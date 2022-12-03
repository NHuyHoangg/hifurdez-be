"use strict";
const { pool } = require("../database/dbinfo");

module.exports = {
  get: (req, res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
    let sql =
      "SELECT product_product.sku " +
      "     , product_product.id " +
      "     , product_product.name AS product_name" +
      "     , product_product.price " +
      "     , product_product.discount_price" +
      "     , product_collection.name AS collection_name " +
      "     , product_category.name AS category_name " +
      "     , REPLACE(media_1.content, 'FFFFFF', 'f0eae2') AS product_image_1 " +
      "     , media_2.content AS product_image_2 " +
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
      "    ON product_product.id = media_2.product_id;";

    pool.query(sql, (err, response) => {
      if (err) throw err;

      res.json(response);
    });
  },
  detail: (req, res) => {
          res.set("Access-Control-Allow-Origin", "*");
          res.set("Access-Control-Allow-Methods", "GET, POST");
          res.set("Access-Control-Allow-Headers", "Content-Type");
    let data = req.body.id;
    let sql = 
      "SELECT *" +
      "  FROM product_product_media" +
      " WHERE id = ?";
    pool.query(sql, [data], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },
  random: (req, res) => {
    let sql =
      "SELECT id" +
      "     , product_name" +
      "     , price" +
      "     , discount_price" +
      "     , media_0" +
      "     , media_1" +
      "  FROM product_product_media" +
      " ORDER BY RAND()" +
      " LIMIT 8;";
    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  randomBySpring: (req, res) => {
          res.set("Access-Control-Allow-Origin", "*");
          res.set("Access-Control-Allow-Methods", "GET, POST");
          res.set("Access-Control-Allow-Headers", "Content-Type");
    let sql =
      "SELECT id" +
      "     , product_name" +
      "     , price" +
      "     , discount_price" +
      "     , media_0" +
      "     , media_1" +
      "  FROM product_product_media" +
      " WHERE collection_id = 1" +
      " ORDER BY RAND()" +
      " LIMIT 8;";
    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  randomBySummer: (req, res) => {
          res.set("Access-Control-Allow-Origin", "*");
          res.set("Access-Control-Allow-Methods", "GET, POST");
          res.set("Access-Control-Allow-Headers", "Content-Type");
    let sql =
      "SELECT id" +
      "     , product_name" +
      "     , price" +
      "     , discount_price" +
      "     , media_0" +
      "     , media_1" +
      "  FROM product_product_media" +
      " WHERE collection_id = 2" +
      " ORDER BY RAND()" +
      " LIMIT 8;";
    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  randomByAutumn: (req, res) => {
          res.set("Access-Control-Allow-Origin", "*");
          res.set("Access-Control-Allow-Methods", "GET, POST");
          res.set("Access-Control-Allow-Headers", "Content-Type");
    let sql =
      "SELECT id" +
      "     , product_name" +
      "     , price" +
      "     , discount_price" +
      "     , media_0" +
      "     , media_1" +
      "  FROM product_product_media" +
      " WHERE collection_id = 3" +
      " ORDER BY RAND()" +
      " LIMIT 8;";
    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  randomByWinter: (req, res) => {
          res.set("Access-Control-Allow-Origin", "*");
          res.set("Access-Control-Allow-Methods", "GET, POST");
          res.set("Access-Control-Allow-Headers", "Content-Type");
    let sql =
      "SELECT id" +
      "     , product_name" +
      "     , price" +
      "     , discount_price" +
      "     , media_0" +
      "     , media_1" +
      "  FROM product_product_media" +
      " WHERE collection_id = 4" +
      " ORDER BY RAND()" +
      " LIMIT 8;";
    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },
};
