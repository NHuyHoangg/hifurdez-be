"use strict";
const { json } = require("body-parser");
const { pool } = require("../database/dbinfo");

module.exports = {
  users: (req, res) => {
    let result = {};
    let sql = 
        "SELECT *" +
        "  FROM stock_warehouse;";
    pool.query(sql, (err, response) => {
      if (err) throw err;
      result['key1'] = response;
      let sql2 = 
            "SELECT *" +
            "  FROM res_users" +
            " LIMIT 5;";
        pool.query(sql2, (err2, response2) => {
            if (err2) throw err2;
            result['key2'] = response2;
            console.log(result);
            res.json(result);
        });
    });
  },
};
