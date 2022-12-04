"use strict";
const { json } = require("body-parser");
const { pool } = require("../database/dbinfo");

module.exports = {
  products: (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
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

  productsDetail: (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
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
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    let sql = 
        "SELECT sale.id AS order_id" +
        "     , sale.name AS code" +
        "     , rp.name AS supplier_name" +
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
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    let result = {};
    let id = req.body.id;
    let saleInfo = 
        "SELECT sale.name AS so_code" +
        "     , tc.code AS transport_card_code"+
        "     , DATE_FORMAT(sale.delivery_date, '%Y/%m/%d') AS delivery_date" +
        "     , product_amount" +
        "     , rp.name AS supplier_name" +
        "     , rp.phone AS supplier_phone" +
        "     , is_active" +
        "  FROM sale_order AS sale" +
        "  LEFT JOIN res_partner AS rp" +
        "    ON sale.supplier_id = rp.id"+
        "  LEFT JOIN stock_move AS sm" +
        "    ON sale.id = sm.po_id" +
        " WHERE sale.id = ?" +
        " LIMIT 1;";
    pool.query(saleInfo, [id, id], (err, response) => {
        if (err) throw err;
        result['sale_order'] = response;
        let saleOrderLine = 
            "SELECT name" +
            "     , price_unit AS price" +
            "     , product_amount" +
            "     , total_price" +
            "  FROM purchaser_order_line" +
            " WHERE po_id = ?;";
        pool.query(saleOrderLine, [id], (err2, response2) => {
            if (err2) throw err2;
            result['sale_order_line'] = response2;
            res.json(result);
        });
    });
  },

  purchase: (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
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
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    let result = {};
    let id = req.body.id;
    let purchaseInfo = 
        "SELECT purchase.name AS po_code" +
        "     , (SELECT stock_picking.name"+
        "          FROM stock_move "+
        "          LEFT JOIN stock_picking"+
        "            ON stock_move.stock_picking_id = stock_picking.id"+
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
        "    ON purchase.supplier_id = rp.id"+
        "  LEFT JOIN stock_move AS sm" +
        "    ON purchase.id = sm.po_id" +
        " WHERE purchase.id = ?" +
        " LIMIT 1;";
    pool.query(purchaseInfo, [id, id], (err, response) => {
        if (err) throw err;
        result['purchase_order'] = response;
        let purchaseOrderLine = 
            "SELECT name" +
            "     , price_unit AS price" +
            "     , product_amount" +
            "     , total_price" +
            "  FROM purchaser_order_line" +
            " WHERE po_id = ?;";
        pool.query(purchaseOrderLine, [id], (err2, response2) => {
            if (err2) throw err2;
            result['purchase_order_line'] = response2;
            res.json(result);
        });
    });
  },

  thirdParty: (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
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

  thirdPartyDetail: (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
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
    pool.query(thirdPartyInfo, [id], (err, response) => {
        if (err) throw err;
        result['thirdPartyInfo'] = response;
        let thirdPartyEmployee = 
            "SELECT id" +
            "     , driver_name" +
            "     , driver_phone" +
            "     , driver_license" +
            "     , is_active" +
            "  FROM third_party_employee" +
            " WHERE third_party_id = ?;";
        pool.query(thirdPartyEmployee, [id], (err, response2) => {
            if (err) throw err;
            result['thirdPartyEmployee'] = response2;
            res.json(result);
        });    
    });
  },

  thirdPartyEmployee: (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
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

  thirdPartyEmployeeDetail: (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
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
    pool.query(thirdPartyEmployeeInfo, [id], (err, response) => {
        if (err) throw err;
        result['thirdPartyEmployeeInfo'] = response;
        let thirdPartyEmployeeOrder = 
            "SELECT tc.code" +
            "     , tc.delivery_date" +
            "     , so.amount_total" +
            "     , so.product_amount" +
            "     , tc.status" +
            "  FROM transport_card AS tc" +
            "  LEFT JOIN sale_order AS so" +
            "    ON so.id = tc.sale_order_id" +
            " WHERE tc.third_party_employee_id = ?;";
        pool.query(thirdPartyEmployeeOrder, [id], (err, response2) => {
            if (err) throw err;
            result['thirdPartyEmployeeOrder'] = response2;
            res.json(result);
        });    
    });
  },

  warehouse: (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    let sql = "";
    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  warehouseDetail: (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    let id = req.body.id;
    let sql = ""
    pool.query(sql, [id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },
};
