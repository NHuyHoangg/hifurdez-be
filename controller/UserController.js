"use strict";
const { pool } = require("../database/dbinfo");

module.exports = {
  getInfo: (req, res) => {
    let id = req.body.id;
    let info =
      "SELECT user.id " +
      "     , user.name " +
      "     , user.phone" +
      "     , user.street" +
      "     , user.user_mail" +
      "     , user.display_name AS user_name" +
      "     , rw.name AS ward" +
      "     , rd.name AS district" +
      "     , rp.name AS province" +
      "  FROM res_partner AS user" +
      "  LEFT JOIN res_ward AS rw" +
      "    ON customer.ward_id = rw.id" +
      "  LEFT JOIN res_district AS rd" +
      "    ON customer.district_id = rd.id" +
      "  LEFT JOIN res_province AS rp" +
      "    ON customer.province_id = rp.id" +
      " WHERE user.id = ?;";

    pool.query(info, [id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  confirmUserPassword: (req, res) => {
    let id = req.body.id;
    let password = req.body.password;
    let check =
      "SELECT " +
      "       CASE" +
      "             WHEN user.password = SHA1(?) THEN 1" +
      "             ELSE 0" +
      "       END AS is_right" +
      "  FROM res_partner AS user" +
      " WHERE user.id = ?;";

    pool.query(check, [password, id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  changeInfo: (req, res) => {
    let fullname = req.body.fullname;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let street = req.body.street;
    let ward = req.body.ward;
    let district = req.body.district;
    let province = req.body.province;

    let sql = "SELECT id " + "  FROM res_partner " + " WHERE user_mail = ?;";

    let updateUser =
      "UPDATE res_partner " +
      "   SET name = ? " +
      "     , phone = ? " +
      "     , street = ? " +
      "     , user_mail = ? " +
      "     , display_name = ? " +
      "     , password = SHA1(?) " +
      "     , ward_id = ? " +
      "     , district_id = ? " +
      "     , province_id = ? " +
      " WHERE id = ?;";

    pool.query(sql, [email], (err, response) => {
      if (err) throw err;
      pool.query(
        updateUser,
        [
          fullname,
          phone,
          street,
          email,
          username,
          password,
          ward,
          district,
          province,
          response[0].id,
        ],
        (err1, response1) => {
          if (err1) throw err1;
          res.json(response1);
        }
      );
    });
  },

  // changeImage: (req, res) => {
  //   let id = req.body.id;
  //   let image = req.body.image;
  //   let updateUser =
  //     "UPDATE res_partner " + "   SET image = ? " + " WHERE id = ?;";

  //   pool.query(updateUser, [image, id], (err, response) => {
  //     if (err) throw err;
  //     res.json({ message: "Update successful" });
  //   });
  // },

  userSale: (req, res) => {
    let id = req.body.id;
    let sql =
      "SELECT sale.id AS order_id" +
      "     , sale.name AS code" +
      "     , DATE_FORMAT(order_date, '%Y/%m/%d') AS order_date" +
      "     , DATE_FORMAT(commitment_date, '%Y/%m/%d') AS delivery_date" +
      "     , product_amount" +
      "     , amount_total" +
      "     , is_active" +
      "  FROM sale_order AS sale" +
      "  LEFT JOIN res_partner AS rp" +
      "    ON sale.customer_id = rp.id" +
      " WHERE sale.customer_id = ?;";

    pool.query(sql, [id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  userSaleDetail: (req, res) => {
    let result = {};
    let id = req.body.id;
    let saleInfo =
      "SELECT sale.name AS so_code" +
      "     , tc.code AS transport_card_code" +
      "     , DATE_FORMAT(sale.commitment_date, '%Y/%m/%d') AS delivery_date" +
      "     , product_amount" +
      "     , rp.name AS customer_name" +
      "     , rp.phone AS customer_phone" +
      "     , rp.street AS street" +
      "     , (SELECT name" +
      "          FROM res_ward" +
      "         WHERE res_ward.id = rp.ward_id) AS ward" +
      "     , (SELECT name" +
      "          FROM res_district" +
      "         WHERE res_district.id = rp.district_id) AS district" +
      "     , (SELECT name" +
      "          FROM res_province" +
      "         WHERE res_province.id = rp.province_id) AS province" +
      "  FROM sale_order AS sale" +
      "  LEFT JOIN res_partner AS rp" +
      "    ON sale.customer_id = rp.id" +
      "  LEFT JOIN transport_card AS tc" +
      "    ON sale.id = tc.sale_order_id" +
      " WHERE sale.id = ?" +
      " LIMIT 1;";

    let saleOrderLine =
      "SELECT pd.name AS product_name" +
      "     , price_unit AS price" +
      "     ,(" +
      "       SELECT clt.name" +
      "       FROM product_collection AS clt" +
      "       LEFT JOIN product_product " +
      "         ON product_product.collection_id = clt.id" +
      "      WHERE product_id = sale_order_line.product_id" +
      "     ) AS collection_name" +
      "     , product_amount" +
      "     , total_price" +
      "  FROM sale_order_line" +
      "  LEFT JOIN product_product AS pd" +
      "    ON sale_order_line.product_id = pd.id" +
      " WHERE so_id = ?;";

    let totalPrice =
      "SELECT amount_total" + "  FROM sale_order" + " WHERE id = ?;";

    pool.query(saleInfo, [id], (err, response) => {
      if (err) throw err;
      result["sale_order"] = response;

      pool.query(saleOrderLine, [id], (err2, response2) => {
        if (err2) throw err2;
        result["sale_order_line"] = response2;

        pool.query(totalPrice, [id], (err3, response3) => {
          if (err3) throw err3;
          result["total_price"] = response3;
          res.json(result);
        });
      });
    });
  },
};
