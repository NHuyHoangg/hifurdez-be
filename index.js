const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { pool } = require("./database/dbinfo");
const app = express();
const productsCtrl = require("./controller/ProductController");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("i love u");
});

// test connect
app.use("/server/test", require("./test"));

//api route
/**
    Phân route theo từng nhóm
**/

app.route("/products").get(productsCtrl.get);

// app.route("/products/:productId")
//     .get(productsCtrl.detail)

//auth
app.use("/server/auth", require("./controller/AuthController"));
//product

//

app.listen("3001", () => {
  console.log("server started running on 3001");
});
