"use strict";
const { json } = require("body-parser");
const { pool } = require("../database/dbinfo");

module.exports = {
  login: (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let sql = 
      "SELECT *" +
      "  FROM cn_account" +
      " WHERE username = ?" + 
      "   AND password = ?;";
    pool.query(sql, [username, password], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  signupCheckExist: (req, res) => {
    let sql = 
      "SELECT username" +
      "  FROM cn_account;";
    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  signup: (req, res) => {
    let id = req.body.id;
    let username = req.body.username;
    let password = req.body.password;
    let sql = 
      "INSERT INTO cn_account" +
      "VALUES (?, ?, ?);"; 
    pool.query(sql, [id, username, password], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  allUser: (req, res) => {
    let current_id = req.query.current_id;
    let sql =
      "SELECT *" +
      "  FROM cn_account" +
      " WHERE id != ?;";
    pool.query(sql, [current_id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

};
