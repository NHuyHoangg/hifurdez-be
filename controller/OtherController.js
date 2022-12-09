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

//   cart: (req, res) => {
//     let sql ="";
//     pool.query(sql, (err, response) => {
//       if (err) throw err;
//       res.json(response);
//     });
//   }, 

//   checkout: (req, res) => {
//     let sql ="";
//     pool.query(sql, (err, response) => {
//       if (err) throw err;
//       res.json(response);
//     });
//   },
};