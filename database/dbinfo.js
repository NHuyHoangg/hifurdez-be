const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const pool = new mysql.createConnection(process.env.DATABASE_URL);

// test connect
// pool.query(
//   "CREATE TABLE res_users (id INT, name TEXT, user_mail     TEXT, password      TEXT, is_active     INT, department_id INT, create_uid    INT, create_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP, write_uid     INT,write_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))",
//   function (err, results) {
//     // console.log(results);
//   }
// );

// pool.query("INSERT INTO res_users (id,user_mail,password) VALUES (1,'bc@example.com',123)", function (err, results) {
//   console.log(results);
// });

// pool.query("update `res_users` set name = 'test' where id = 1", function (err, results) {
//   console.log(results);
// });


pool.query("SELECT * FROM `res_users`", function (err, results) {
  console.log(results);
});

module.exports = {
  pool,
};
