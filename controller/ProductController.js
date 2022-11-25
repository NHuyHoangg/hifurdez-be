"use strict";
const express = require("express");
const router = express.Router();
const util = require("util");
const mysql = require("mysql2");
const { pool } = require("../database/dbinfo");

module.exports = {
  get: (req, res) => {
    let sql = (
        'SELECT product_product.sku '+
        ', product_product.id ' + 
        '  , product_product.name AS product_name'+
      '    , product_product.price '+
      '    , product_product.discount_price'+
        ' , product_collection.name AS collection_name '+
      '   , product_category.name AS category_name '+
      '   , image.content AS product_image '+
      ' FROM product_product '+
      ' LEFT JOIN product_collection '+
        ' ON product_product.collection_id = product_collection.id '+
      ' LEFT JOIN product_category '+
      '   ON product_product.category_id = product_category.id '+
      ' LEFT JOIN ( '+
                  '  SELECT a.id AS id '+
                  '    , a.content '+
                  '    , a.product_id AS product_id '+
                  'FROM product_media as a '+
                  'WHERE a.id = ( '+
                  'SELECT b.id '+
                  'FROM product_media as b '+
                  'WHERE a.product_id = b.product_id '+
                  'ORDER BY b.id ASC '+
                  'LIMIT 1)) AS image'+
                  "          "+
      '   ON product_product.id = image.product_id;'
    );
    console.log (sql);
    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  }
};
