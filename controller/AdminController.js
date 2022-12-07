"use strict";
const { pool } = require("../database/dbinfo");

module.exports = {
  users: (req, res) => {
    let sql =
      "SELECT DATE_FORMAT(create_date, '%Y/%m/%d') as created_date" +
      "     , DATE_FORMAT(last_active, '%Y/%m/%d') as last_active" +
      "     , name" +
      "     , user_mail" +
      "     , display_name" +
      "     , is_active" +
      "  FROM res_partner" +
      " WHERE is_supplier =  0;";

    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  usersDetail: (req, res) => {
    let customer_info = {};
    let id = req.body.id;
    let sql =
      "SELECT rp.id AS id" +
      "     , rp.name AS full_name" +
      "     , rp.display_name as name" +
      "     , rp.user_mail AS email" +
      "     , phone" +
      "     , rp.street AS street" +
      "     , rw.name AS ward" +
      "     , rd.name AS district" +
      "     , rpp.name AS province" +
      "  FROM res_partner as rp" +
      "  LEFT JOIN res_ward AS rw" +
      "    ON rp.ward_id = rw.id" +
      "  LEFT JOIN res_district AS rd" +
      "    ON rp.district_id = rd.id" +
      "  LEFT JOIN res_province AS rpp" +
      "    ON rp.province_id = rpp.id" +
      " WHERE rp.id = ?;";

    let sale_order =
      "SELECT name" +
      "     , tc.code AS transport_card_code" +
      "     , commitment_date" +
      "     , amount_total" +
      "     , sale.status" +
      "  FROM sale_order AS sale" +
      "  LEFT JOIN transport_card AS tc" +
      "    ON sale.id = tc.sale_order_id" +
      " WHERE customer_id = ?;";
    
    let total_price =
      "SELECT SUM(amount_total)" +
      "  FROM sale_order" +
      " WHERE customer_id = ?;";

    pool.query(sql, [id], (err1, response1) => {
      if (err1) throw err1;
      customer_info["info"] = response1;

      pool.query(sale_order, [id], (err2, response2) => {
        if (err2) throw err2;
        customer_info["so"] = response2;

        pool.query(total_price, [id], (err3, response3) => {
          if (err3) throw err3;
          customer_info["total_price"] = response3;
          res.json(customer_info);
        });
      });
    });
    
  },

  userChangeStatus: (req, res) => {
    let sql =
      "UPDATE res_partner" +
      "   SET is_active =" +
      "       (CASE " +
      "             WHEN is_active = 0 THEN 1" +
      "             ELSE 0" +
      "       END)" +
      " WHERE id = ?;";   
    pool.query(sql, [req.body.id], (err, response) => {
      if (err) throw err;
      res.json({ message: "Update success!" });
    });
  },

  products: (req, res) => {
    let sql =
      "SELECT pdt.id AS product_id" +
      "     , clt.name AS collection" +
      "     , cate.name AS category" +
      "     , sku" +
      "     , pdt.name AS product_name" +
      "     , price" +
      "     , discount_price" +
      "     , is_active" +
      "  FROM product_product AS pdt" +
      "  LEFT JOIN product_category AS cate" +
      "    ON pdt.category_id = cate.id" +
      "  LEFT JOIN product_collection AS clt" +
      "    ON pdt.collection_id = clt.id;";
    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  productChangeStatus: (req, res) => {
    let pd =
      "UPDATE product_product" +
      "   SET is_active =" +
      "       (CASE " +
      "             WHEN is_active = 0 THEN 1" +
      "             ELSE 0" +
      "       END)" +
      " WHERE id = ?;";   

    let pdm =
      "UPDATE product_product_media" +
      "   SET is_active =" +
      "       (CASE " +
      "             WHEN is_active = 0 THEN 1" +
      "             ELSE 0" +
      "       END)" +
      " WHERE id = ?;";   
    pool.query(pd, [req.body.id], (err, response) => {
      if (err) throw err;
      pool.query(pdm, [req.body.id], (err1, response1) => {
        if (err1) throw err1;
        res.json({ message: "Update success!" });
      });
    });
  },

  productsDetail: (req, res) => {
    let id = req.body.id;
    let sql =
      "SELECT sku" +
      "     , clt.name AS collection" +
      "     , cate.name AS category" +
      "     , pdt.name AS product_name" +
      "     , price" +
      "     , discount_price" +
      "     , weight" +
      "     , width" +
      "     , depth" +
      "     , height" +
      "     , material" +
      "     , color" +
      "     , description" +
      "  FROM product_product AS pdt" +
      "  LEFT JOIN product_category AS cate" +
      "    ON pdt.category_id = cate.id" +
      "  LEFT JOIN product_collection AS clt" +
      "    ON pdt.collection_id = clt.id" +
      " WHERE pdt.id = ?;";

    pool.query(sql, [id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  sale: (req, res) => {
    let sql =
      "SELECT sale.id AS order_id" +
      "     , sale.name AS code" +
      "     , rp.name AS customer_name" +
      "     , DATE_FORMAT(order_date, '%Y/%m/%d') AS order_date" +
      "     , DATE_FORMAT(commitment_date, '%Y/%m/%d') AS delivery_date" +
      "     , product_amount" +
      "     , amount_total" +
      "     , is_active" +
      "  FROM sale_order AS sale" +
      "  LEFT JOIN res_partner AS rp" +
      "    ON sale.customer_id = rp.id;";

    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  saleDetail: (req, res) => {
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
      "SELECT amount_total" +
      "  FROM sale_order" +
      " WHERE id = ?;";

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

  purchase: (req, res) => {
    let sql =
      "SELECT purchase.id AS order_id" +
      "     , purchase.name AS code" +
      "     , rp.name AS supplier_name" +
      "     , DATE_FORMAT(order_date, '%Y/%m/%d') AS order_date" +
      "     , DATE_FORMAT(delivery_date, '%Y/%m/%d') AS delivery_date" +
      "     , product_amount" +
      "     , amount_total" +
      "     , is_active" +
      "  FROM purchaser_order AS purchase" +
      "  LEFT JOIN res_partner AS rp" +
      "    ON purchase.supplier_id = rp.id;";

    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  purchaseDetail: (req, res) => {
    let result = {};
    let id = req.body.id;
    let purchaseInfo =
      "SELECT purchase.name AS po_code" +
      "     , (SELECT stock_picking.name" +
      "          FROM stock_move " +
      "          LEFT JOIN stock_picking" +
      "            ON stock_move.stock_picking_id = stock_picking.id" +
      "         WHERE stock_move.po_id = ?" +
      "         LIMIT 1) AS picking_code" +
      "     , sm.name AS move_code" +
      "     , DATE_FORMAT(purchase.delivery_date, '%Y/%m/%d') AS delivery_date" +
      "     , product_amount" +
      "     , rp.name AS supplier_name" +
      "     , rp.phone AS supplier_phone" +
      "     , is_active" +
      "  FROM purchaser_order AS purchase" +
      "  LEFT JOIN res_partner AS rp" +
      "    ON purchase.supplier_id = rp.id" +
      "  LEFT JOIN stock_move AS sm" +
      "    ON purchase.id = sm.po_id" +
      " WHERE purchase.id = ?" +
      " LIMIT 1;";
    
    let purchaseOrderLine =
      "SELECT name" +
      "     , price_unit AS price" +
      "     , product_amount" +
      "     , total_price" +
      "  FROM purchaser_order_line" +
      " WHERE po_id = ?;";

    let totalPrice =
      "SELECT amount_total" +
      "  FROM purchaser_order" +
      " WHERE id = ?;";

    pool.query(purchaseInfo, [id, id], (err, response) => {
      if (err) throw err;
      result["purchase_order"] = response;
      
      pool.query(purchaseOrderLine, [id], (err2, response2) => {
        if (err2) throw err2;
        result["purchase_order_line"] = response2;

        pool.query(totalPrice, [id], (err3, response3) => {
          if (err3) throw err3;
          result["total_price"] = response3;
          res.json(result);
        });
      });
    });
  },

  thirdParty: (req, res) => {
    let sql =
      "SELECT id" +
      "     , name" +
      "     , tax_code AS tax" +
      "     , DATE_FORMAT(start_date, '%Y/%m/%d') AS start_date" +
      "     , DATE_FORMAT(end_date, '%Y/%m/%d') AS end_date" +
      "     , is_active" +
      "  FROM third_party_company;";

    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  thirdPartyChangeStatus: (req, res) => {
    let sql =
      "UPDATE third_party_company" +
      "   SET is_active =" +
      "       (CASE " +
      "             WHEN is_active = 0 THEN 1" +
      "             ELSE 0" +
      "       END)" +
      " WHERE id = ?;";   

    let setAllUserStatus = 
      "UPDATE third_party_employee" +
      "   SET is_active =" +
      "       (CASE " +
      "             WHEN" +
      "               (SELECT is_active" +
      "               FROM third_party_company" +
      "               WHERE id = ?) = 0 THEN 1" +
      "             ELSE 0" +
      "       END)" +
      " WHERE third_party_id = ?;"; 
    
    pool.query(setAllUserStatus, [req.body.id, req.body.id], (err2, response2) => {
      if (err2) throw err2;

      pool.query(sql, [req.body.id], (err3, response3) => {
        if (err3) throw err3;
        res.json({ message: "Update success!" });
      });
    });
  },

  thirdPartyDetail: (req, res) => {
    let result = {};
    let id = req.body.id;
    let thirdPartyInfo =
      "SELECT id" +
      "     , name" +
      "     , tax_code AS tax" +
      "     , DATE_FORMAT(start_date, '%Y/%m/%d') AS start_date" +
      "     , DATE_FORMAT(end_date, '%Y/%m/%d') AS end_date" +
      "     , is_active" +
      "  FROM third_party_company" +
      " WHERE id = ?;";

    let thirdPartyEmployee =
      "SELECT id" +
      "     , driver_name" +
      "     , driver_phone" +
      "     , driver_license" +
      "     , is_active" +
      "  FROM third_party_employee" +
      " WHERE third_party_id = ?;";

    pool.query(thirdPartyInfo, [id], (err, response) => {
      if (err) throw err;
      result["thirdPartyInfo"] = response;

      pool.query(thirdPartyEmployee, [id], (err, response2) => {
        if (err) throw err;
        result["thirdPartyEmployee"] = response2;
        res.json(result);
      });
    });
  },

  thirdPartyEmployee: (req, res) => {
    let sql =
      "SELECT employee.id AS id" +
      "     , driver_name" +
      "     , driver_phone" +
      "     , driver_citizen_identification" +
      "     , driver_license" +
      "     , employee.is_active" +
      "     , company.name AS company_name" +
      "  FROM third_party_employee AS employee" +
      "  LEFT JOIN third_party_company AS company" +
      "    ON company.id = employee.third_party_id;";

    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  thirdPartyEmployeeChangeStatus: (req, res) => {
    let sql =
      "UPDATE third_party_employee" +
      "   SET is_active =" +
      "       (CASE " +
      "             WHEN is_active = 0 THEN 1" +
      "             ELSE 0" +
      "       END)" +
      " WHERE id = ?;";   
    pool.query(sql, [req.body.id], (err, response) => {
      if (err) throw err;
      res.json({ message: "Update success!" });
    });
  },

  thirdPartyEmployeeDetail: (req, res) => {
    let result = {};
    let id = req.body.id;
    let thirdPartyEmployeeInfo =
      "SELECT employee.id AS id" +
      "     , driver_name" +
      "     , driver_phone" +
      "     , driver_citizen_identification" +
      "     , driver_license" +
      "     , employee.is_active" +
      "     , company.name AS company_name" +
      "  FROM third_party_employee AS employee" +
      "  LEFT JOIN third_party_company AS company" +
      "    ON company.id = employee.third_party_id" +
      " WHERE employee.id = ?;";

    let thirdPartyEmployeeOrder =
      "SELECT tc.code" +
      "     , DATE_FORMAT(tc.delivery_date, '%Y/%m/%d') AS delivery_date" +
      "     , so.amount_total" +
      "     , so.product_amount" +
      "     , tc.status" +
      "  FROM transport_card AS tc" +
      "  LEFT JOIN sale_order AS so" +
      "    ON so.id = tc.sale_order_id" +
      " WHERE tc.third_party_employee_id = ?;";
      
    pool.query(thirdPartyEmployeeInfo, [id], (err, response) => {
      if (err) throw err;
      result["thirdPartyEmployeeInfo"] = response;

      pool.query(thirdPartyEmployeeOrder, [id], (err, response2) => {
        if (err) throw err;
        result["thirdPartyEmployeeOrder"] = response2;
        res.json(result);
      });
    });
  },

  warehouse: (req, res) => {
    let sql =
      "SELECT sw.id" +
      "     , sw.code" +
      "     , sw.name" +
      "     , sw.street" +
      "     , rw.name AS ward" +
      "     , rd.name AS district" +
      "     , rp.name AS province" +
      "     , is_active" +
      "  FROM stock_warehouse AS sw" +
      "  LEFT JOIN res_ward AS rw" +
      "    ON sw.ward_id = rw.id" +
      "  LEFT JOIN res_district AS rd" +
      "    ON sw.district_id = rd.id" +
      "  LEFT JOIN res_province AS rp" +
      "    ON sw.province_id = rp.id;";

    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  warehouseChangeStatus: (req, res) => {
    let sql =
      "UPDATE stock_warehouse" +
      "   SET is_active =" +
      "       (CASE " +
      "             WHEN is_active = 0 THEN 1" +
      "             ELSE 0" +
      "       END)" +
      " WHERE id = ?;";   
    pool.query(sql, [req.body.id], (err, response) => {
      if (err) throw err;
      res.json({ message: "Update success!" });
    });
  },

  warehouseDetail: (req, res) => {
    let id = req.body.id;
    let result = {};
    let warehouseInfo =
      "SELECT sw.name" +
      "     , sw.code" +
      "     , sw.street" +
      "     , rw.name AS ward" +
      "     , rd.name AS district" +
      "     , rp.name AS province" +
      "     , is_active" +
      "  FROM stock_warehouse AS sw" +
      "  LEFT JOIN res_ward AS rw" +
      "    ON sw.ward_id = rw.id" +
      "  LEFT JOIN res_district AS rd" +
      "    ON sw.district_id = rd.id" +
      "  LEFT JOIN res_province AS rp" +
      "    ON sw.province_id = rp.id" +
      " WHERE sw.id = ?;";

    let receive =
      "SELECT x.picking_code AS picking_code" +
      "     , DATE_FORMAT(x.date, '%Y/%m/%d') AS date" +
      "     , sm.name AS code" +
      "     , po.product_amount AS product_amount" +
      "     , x.third_party_name AS third_party_name" +
      "  FROM stock_move AS sm" +
      "  LEFT JOIN " +
      "     (SELECT sp.id AS id" +
      "           , sp.name AS picking_code" +
      "           , sp.warehouse_id AS warehouse_id" +
      "           , sp.dest_warehouse_id AS dest_warehouse_id" +
      "           , sp.delivery_date AS date" +
      "           , tpt.name AS third_party_name" +
      "        FROM stock_picking AS sp" +
      "        LEFT JOIN third_party_company AS tpt" +
      "          ON sp.third_party_id = tpt.id) AS x" +
      "    ON sm.stock_picking_id = x.id" +
      "  LEFT JOIN purchaser_order AS po" +
      "    ON sm.po_id = po.id" +
      " WHERE x.warehouse_id IS NULL AND x.dest_warehouse_id = ? ";
    
    let transfer =
      "SELECT x.picking_code AS transfer_code" +
      "     , DATE_FORMAT(x.date, '%Y/%m/%d') AS date" +
      "     , x.third_party_name AS third_party_name" +
      "     , po.product_amount AS product_amount" +
      "     , x.src_name AS src_warehouse" +
      "     , x.dest_name AS dest_warehouse" +
      "  FROM stock_move AS sm" +
      "  LEFT JOIN " +
      "     (SELECT sp.id AS id" +
      "           , sp.name AS picking_code" +
      "           , sp.warehouse_id AS warehouse_id" +
      "           , (CASE" +
      "                  WHEN sp.warehouse_id = 1 THEN 'Ho Chi Minh City'" +
      "                  ELSE 'Binh Duong Province'" +
      "              END) AS src_name" +
      "           , sp.dest_warehouse_id AS dest_warehouse_id" +
      "           , (CASE" +
      "                  WHEN sp.dest_warehouse_id = 1 THEN 'Ho Chi Minh City'" +
      "                  ELSE 'Binh Duong Province'" +
      "              END) AS dest_name" +
      "           , sp.delivery_date AS date" +
      "           , tpt.name AS third_party_name" +
      "        FROM stock_picking AS sp" +
      "        LEFT JOIN third_party_company AS tpt" +
      "          ON sp.third_party_id = tpt.id) AS x" +
      "    ON sm.stock_picking_id = x.id" +
      "  LEFT JOIN purchaser_order AS po" +
      "    ON sm.po_id = po.id " +
      " WHERE x.warehouse_id = ?;";

    let delivery =
      "SELECT tc.code AS code" +
      "     , x.customer_name AS customer_name" +
      "     , x.amount_total AS amount_total" +
      "     , x.product_amount AS product_amount" +
      "     , tpt.name AS third_party" +
      "     , tc.street AS street" +
      "     , rw.name AS ward" +
      "     , rd.name AS district" +
      "     , rp.name AS province" +
      "  FROM transport_card  AS tc" +
      "  LEFT JOIN " +
      "            (SELECT so.product_amount AS product_amount" +
      "                  , so.id AS id" +
      "                  , so.amount_total AS amount_total" +
      "                  , ctm.name AS customer_name" +
      "               FROM sale_order AS so" +
      "               LEFT JOIN res_partner AS ctm" +
      "                 ON so.customer_id = ctm.id) AS x" +
      "         ON x.id = tc.sale_order_id " +
      "  LEFT JOIN third_party_company AS tpt" +
      "    ON tc.third_party_id = tpt.id" +
      "  LEFT JOIN res_ward AS rw" +
      "    ON tc.ward_id = rw.id" +
      "  LEFT JOIN res_district AS rd" +
      "    ON tc.district_id = rd.id" +
      "  LEFT JOIN res_province AS rp" +
      "    ON tc.province_id = rp.id" +
      " WHERE tc.warehouse_id = ?;";

    pool.query(warehouseInfo, [id], (err, response) => {
      if (err) throw err;
      result["warehouseInfo"] = response;

      pool.query(receive, [id], (err1, response1) => {
        if (err1) throw err1;
        result["receive"] = response1;

        pool.query(transfer, [id], (err2, response2) => {
          if (err2) throw err2;
          result["transfer"] = response2;

          pool.query(delivery, [id], (err3, response3) => {
            if (err3) throw err3;
            result["delivery"] = response3;
            res.json(result);
          });
        });
      });
    });
  },
};
