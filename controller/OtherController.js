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
//   checkout: (req, res) => {
//     let sql ="";
//     pool.query(sql, (err, response) => {
//       if (err) throw err;
//       res.json(response);
//     });
//   },
};
