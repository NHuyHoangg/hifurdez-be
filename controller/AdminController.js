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
    let id = req.body.id;
    let purchaseInfo = 
        "SELECT purchase.name AS po_code" +
        "     , (SELECT stock_picking.name"+
        "          FROM stock_move "+
        "          LEFT JOIN stock_picking"+
        "            ON stock_move.stock_picking_id = stock_picking.id"+
        "         WHERE stock_move.po_id = ?) AS picking_code"+
        "     , sm.name AS move_code" +
        "     , DATE_FORMAT(purchase.delivery_date, '%Y/%m/%d') AS delivery_date" +
        "     , product_amount" +
        "     , rp.name AS supplier_name" +
        "     , rp.phone AS supplier_phone" +
        "     , is_active" +
        "  FROM purchaser_order AS purchase" +
        "  LEFT JOIN res_partner AS rp" +
        "    ON purchase.supplier_id = rp.id;";
        "  LEFT JOIN stock_move AS sm" +
        "    ON purchase.id = sm.po_id" +
        " WHERE purchase.id = ?;";
    pool.query(purchaseInfo, [id, id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },
};
