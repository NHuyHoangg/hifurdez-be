"use strict";
const { pool } = require("../database/dbinfo");

module.exports = {
  signIn: (req, res) => {
    let result = {};
    let email = req.body.email;
    let password = req.body.password;
    let login =
      "SELECT id " +
      "  FROM res_partner " +
      " WHERE user_mail = ?" + 
      "   AND password = SHA1(?)" +
      " LIMIT 1;";

    let checkUserStatus =
      "SELECT is_active " +
      "  FROM res_partner " +
      " WHERE id = ?;";
 
    let lastActive =
      "UPDATE res_partner" +
      "   SET last_active = NOW()" +
      " WHERE id = ?;";

    let getUserInfo = 
      "SELECT id, is_admin, display_name " +
      "  FROM res_partner " +
      " WHERE id = ?;";

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
    pool.query(login, [email, password], (err, response) => {
      if (err) throw err;
      if (response.length != 0) {
        pool.query(checkUserStatus, [response[0].id], (err1, response1) => {
          if (err1) throw err1;
          if (response1[0].is_active == 0)  {
            res.json({ message: "Your account have been blocked, try again!" });  
          }
          else {
            pool.query(lastActive, [response[0].id], (err2, response2) => {
              if (err2) throw err2;
              pool.query(getUserInfo, [response[0].id], (err3, response3) => {
                if (err3) throw err3;
                result["user-info"] = response3;
                pool.query(productInfo, [response[0].id], (err4, response4) => {
                  if (err4) throw err4;
                  result["product-info"] = response4;
                  pool.query(totalPrice, [response[0].id], (err5, response5) => {
                    if (err5) throw err5;
                    result["total-price"] = response5;
                    res.json(result);  
                  });
                });
              });
            });
          }
        });
      }
      else res.json({ message: "The username or password is incorrect" });  
    });
  },

  signUp: (req, res) => {
    let fullname = req.body.fullname;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let checkExist =
      "SELECT id " +
      "  FROM res_partner " +
      " WHERE user_mail = ?;";
    
    let getPartnerLength = 
      "SELECT id " +
      "  FROM res_partner " +
      " ORDER BY id DESC" +
      " LIMIT 1;";

    let addUser =
      " INSERT INTO res_partner(id, name, user_mail, display_name, password)" +
      " VALUES (?, ?, ?, ?, SHA1(?));";

    let createCart = 
      " INSERT INTO res_cart(id, customer_id)" +
      " VALUES (?, ?);";

    pool.query(checkExist, [email], (err, response) => {
      if (err) throw err;
      if (response.length != 0) {
        res.json({ message: "Account already exists" });
      }
      else {
        pool.query(getPartnerLength, (err1, response1) => {
          if (err1) throw err1;
          pool.query(addUser, [response1[0].id + 1, fullname, email, username, password], (err2, response2) => {
            if (err2) throw err2;
            pool.query(createCart, [response1[0].id + 1, response1[0].id + 1], (err3, response3) => {
              if (err3) throw err3;
              res.json({ message: "Signup successful" });  
            });
          });
        });
      }
    });
  },
  
};


    
