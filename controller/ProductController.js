"use strict";
const express = require("express");
const router = express.Router();
const util = require("util");
const mysql = require("mysql2");
const { pool } = require("../database/dbinfo");

module.exports = {
  get: (req, res) => {
    let sql = "SELECT * FROM product_product";
    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  }
};
