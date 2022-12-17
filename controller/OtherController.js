"use strict";
const { pool } = require("../database/dbinfo");

module.exports = {
  navBarSearch: (req, res) => {
    let stringName = req.body.stringName;
    let sql =
      "SELECT product_product.sku " +
      "     , product_product.id " +
      "     , product_product.name AS product_name" +
      "     , product_product.price " +
      "     , product_product.discount_price" +
      "     , product_collection.name AS collection_name " +
      "     , product_category.name AS category_name " +
      "     , REPLACE(media_1.content, 'FFFFFF', 'f0eae2') AS product_image_1 " +
      "     , CASE " +
      "         WHEN UPPER(media_2.content) LIKE '%-DIM%' THEN 'https://res.cloudinary.com/castlery/image/private/b_rgb:f0eae2,c_fit,f_auto,q_auto,w_1000/v1624969337/crusader/variants/50440634-PL4001/Hans-3-Seater-Sofa-Light-Grey-Revamped-Lifestyle-Crop.jpg' " +
      "         ELSE media_2.content " +
      "       END AS product_image_2 " +
      "  FROM product_product " +
      "  LEFT JOIN product_collection " +
      "    ON product_product.collection_id = product_collection.id " +
      "  LEFT JOIN product_category " +
      "    ON product_product.category_id = product_category.id " +
      "  LEFT JOIN ( " +
      "       SELECT id AS id " +
      "            , content " +
      "            , product_id " +
      "         FROM product_media" +
      "        WHERE product_index = 1 " +
      "            ) AS media_1" +
      "    ON product_product.id = media_1.product_id" +
      "  LEFT JOIN ( " +
      "       SELECT id AS id " +
      "            , content " +
      "            , product_id " +
      "         FROM product_media" +
      "        WHERE product_index = 2 " +
      "            ) AS media_2" +
      "    ON product_product.id = media_2.product_id" +
      " WHERE product_product.is_active = 1 AND product_product.name LIKE '%?%'";

    pool.query(sql, [stringName] , (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  insertCart: (req, res) => {
    let customer_id = req.body.customer_id;
    let product_id = req.body.product_id;
    let checkExistCart = 
      " SELECT * " +
      "   FROM cart_product " +
      "  WHERE cart_id = ? " +
      "    AND product_id = ?; ";

    let insertCart = 
      " INSERT INTO cart_product(cart_id, product_id)" +
      " VALUES (?, ?);";
    pool.query(checkExistCart, [customer_id, product_id], (err, response) => {
      if (err) throw err;
      if (response.length != 0) {
        res.json({ message: "The product have already existed in cart"});
      }
      else {
        pool.query(insertCart, [customer_id, product_id], (err1, response1) => {
        if (err1) throw err1;
        res.json( {message: "Insert Successfully"});
      });}
      
    });
  }, 

  updateCart: (req, res) => {
    let customer_id = req.body.customer_id;
    let product_id = req.body.product_id;

    let updateCart = 
      " DELETE FROM cart_product" +
      "  WHERE cart_id = ?" +
      "    AND product_id = ?;";
    pool.query(updateCart, [customer_id, product_id], (err, response) => {
      if (err) throw err;
        res.json({ message: "Delete Successfully"});      
    });
  }, 

  getCart: (req, res) => {
    let user_id = req.body.customer_id;
    let result = {};
    let productInfo =
      "SELECT ppm.id AS product_id" +
      "     , ppm.collection_id AS collection_id" +
      "     , ppm.product_name AS product_name" +
      "     , CASE" +
      "            WHEN ppm.discount_price IS NOT NULL THEN ppm.discount_price" +
      "            ELSE ppm.price" +
      "       END AS product_price" +
      "     , media_0 AS product_image" +
      "  FROM cart_product AS cp" +
      "  LEFT JOIN product_product_media AS ppm" +
      "    ON cp.product_id = ppm.id" +
      " WHERE cp.cart_id = ?;";

    let totalPrice =
      "SELECT SUM(CASE" +
      "            WHEN ppm.discount_price IS NOT NULL THEN ppm.discount_price" +
      "            ELSE ppm.price" +
      "       END) AS product_price" +
      "  FROM cart_product AS cp" +
      "  LEFT JOIN product_product_media AS ppm" +
      "    ON cp.product_id = ppm.id" +
      " WHERE cp.cart_id = ?;";
      pool.query(productInfo, [user_id], (err, response) => {
        if (err) throw err;
        result["product-info"] = response;
        pool.query(totalPrice, [user_id], (err1, response1) => {
          if (err1) throw err1;
          result["total-price"] = response1;
          res.json(result);  
        });
      });
  },
  
  checkout: (req, res) => {
    let user_id = req.body.user_id;
    let info =
      "SELECT user.id " +
      "     , user.name " +
      "     , user.phone" +
      "     , user.user_mail" +
      "     , user.street" +
      "     , rw.name AS ward" +
      "     , rw.id AS ward_id" +
      "     , rd.name AS district" +
      "     , rd.id AS district_id" +
      "     , rp.name AS province" +
      "     , rp.id AS province_id" +
      "  FROM res_partner AS user" +
      "  LEFT JOIN res_ward AS rw" +
      "    ON user.ward_id = rw.id" +
      "  LEFT JOIN res_district AS rd" +
      "    ON user.district_id = rd.id" +
      "  LEFT JOIN res_province AS rp" +
      "    ON user.province_id = rp.id" +
      " WHERE user.id = ?;";

    pool.query(info, [user_id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  payup: (req, res) => {
    let user_id = req.body.user_id;
    let user_address = req.body.user_address;
    let user_province = req.body.user_province;
    let user_district = req.body.user_district;
    let user_ward = req.body.user_ward;
    let payment_method = req.body.payment_method;
    let total_amount = req.body.total_amount;
    let product_0 = req.body.product_0;
    let product_1 = req.body.product_1;
    let product_2 = req.body.product_2;
    let product_3 = req.body.product_3;
    let product_4 = req.body.product_4;
    let product_5 = req.body.product_5;
    let product_6 = req.body.product_6;
    let product_7 = req.body.product_7;
    let product_8 = req.body.product_8;
    let product_9 = req.body.product_9;
    let result = [
      product_0,
      product_1,
      product_2,
      product_3,
      product_4,
      product_5,
      product_6,
      product_7,
      product_8,
      product_9
    ];
    
    let resultImport = [];
    let product_amount = 0;
    for (let i = 0; i < result.length; i++) {
      if (result[i] != "test") {
        resultImport.push(result[i]);
        product_amount += 1;
      }
    }

    let delete_cart = 
      "DELETE FROM cart_product " +
      " WHERE cart_id = ?;";
    
    let get_so_id = 
      "SELECT id " +
      "  FROM sale_order " +
      " ORDER BY id DESC" +
      " LIMIT 1;";

    let create_so = 
      "INSERT INTO sale_order (id, name, status, order_date, product_amount, amount_untaxed, amount_tax, amount_total, commitment_date, customer_id, payment_method) " +
      "VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY), ?, ?);";

    let create_tc = 
      "INSERT INTO transport_card (id, code, status, delivery_date, submit_cod, sale_order_id, third_party_employee_id, third_party_id, warehouse_id, street, ward_id, district_id, province_id) " +
      "VALUES (?, ?, 'delivery', DATE_ADD(NOW(), INTERVAL 6 DAY), ?, ?, ?, ?, ? ,? ,? ,? ,?);";

    let get_sol_id = 
      "SELECT id " +
      "  FROM sale_order_line " +
      " ORDER BY id DESC" +
      " LIMIT 1;";
    
    let create_sol = 
      "INSERT INTO sale_order_line (id, product_amount, product_id, so_id) " +
      "VALUES (?, 1, ?, ?);";

    let get_sol_price = 
      "SELECT price " +
      "  FROM product_product " +
      " WHERE id = ?;";

    let update_sol = 
      "UPDATE sale_order_line total_price " +
      "   SET total_price = ? " +
      "     , price_unit = ? " +
      " WHERE id = ?;";

    let total_price = 0;
    pool.query(delete_cart, [user_id], (err, response) => {
      if (err) throw err;
      pool.query(get_so_id, (err1, response1) => {
        if (err1) throw err1;
        pool.query(create_so, [
          Number(response1[0].id) + 1, 
          "SO6000" + String(Number(response1[0].id) + 1),
          "delivery",
          product_amount,
          total_amount * 0.9,
          total_amount * 0.1,
          total_amount,
          user_id, 
          payment_method,
        ], (err2, response2) => {
          if (err2) throw err2;
          pool.query(create_tc, [
            Number(response1[0].id) + 1, 
            "TC0000" + String(Number(response1[0].id) + 1),
            total_amount,
            Number(response1[0].id) + 1, 
            34,
            8,
            2,
            user_address,
            user_ward,
            user_district,
            user_province,
          ], (err3, response3) => {
            if (err3) throw err3;
            pool.query(get_sol_id, (err4, response4) => {
              if (err4) throw err4;
              for (let i = 0; i < resultImport.length; i++) {
                pool.query(create_sol, [Number(response4[0].id) + 1 + Number(i), resultImport[i], Number(response1[0].id) + 1], (err5, response5) => {
                  if (err5) throw err5;
                  pool.query(get_sol_price, [resultImport[i]], (err6, response6) => {
                    if (err6) throw err6;
                    console.log(response6[0].price)
                    pool.query(update_sol, [Number(response6[0].price), Number(response6[0].price), Number(response4[0].id) + 1 + Number(i)], (err7, response7) => {
                      if (err7) throw err7;
                    });
                  });
                });
              } 
              res.json({ message: "Add success!" });
            });
          });
        });
      });
    });
  },
};
