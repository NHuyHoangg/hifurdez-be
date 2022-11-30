"use strict";
const { pool } = require("../database/dbinfo");

module.exports = {
  province: (req, res) => {
    let sql =
        "SELECT id" +
        "     , name" +
        "     , code" +
            "  FROM res_province";
    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },
  district: (req, res) => {
    let sql =
      "SELECT id" +
      "     , name" +
      "     , code" +
      " FROM res_district" +
          " WHERE province_id = ?;";
    pool.query(sql, [req.body.id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },
  ward: (req, res) => {
    let sql =
      "SELECT id" +
      "     , name" +
      "     , code" +
      " FROM res_ward" +
        " WHERE district_id = ?;";
      console.log(sql);
    pool.query(sql, [req.body.id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },
};
