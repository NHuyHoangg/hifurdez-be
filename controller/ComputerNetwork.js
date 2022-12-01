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
      "INSERT INTO cn_account " +
      "VALUES (?, ?, ?);"; 
    pool.query(sql, [id, username, password], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  allUser: (req, res) => {
    let current_id = req.body.current_id;
    let sql =
      "SELECT *" +
      "  FROM cn_account" +
      " WHERE id != ?;";
    pool.query(sql, [current_id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  addFriend: (req, res) => {
    let id = req.body.id;
    let current_id = req.body.current_id;
    let friend_id = req.body.friend_id;
    let port = req.body.port;
    let sql =
      "INSERT INTO cn_friend_list " +
      "VALUES (?, ?, ?, ?);"; 
    pool.query(sql, [id, current_id, friend_id, port], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  allFriend: (req, res) => {
    let current_id = req.body.current_id;
    let sql =
      "SELECT *" +
      "  FROM cn_friend_list " +
      " WHERE current_id = ?" +
      "    OR friend_id = ?;";
    pool.query(sql, [current_id, current_id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  checkFriend: (req, res) => {
    let current_id = req.body.current_id;
    let friend_id = req.body.friend_id;
    let sql =
      "SELECT id" +
      "  FROM cn_friend_list " +
      " WHERE current_id = ?" +
      "   AND friend_id = ?" +
      "    OR friend_id = ?" +
      "   AND current_id = ?;";
    pool.query(sql, [current_id, friend_id, current_id, friend_id], (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },

  getPort: (req, res) => {
    let sql =
      "SELECT COUNT(id) + 1 AS length" +
      "  FROM cn_friend_list; ";
    pool.query(sql, (err, response) => {
      if (err) throw err;
      res.json(response);
    });
  },
};
