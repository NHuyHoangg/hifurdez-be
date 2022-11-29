const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const pool = new mysql.createConnection(process.env.DATABASE_URL);

module.exports = {
  pool,
};
