const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { pool } = require("./database/dbinfo");
const app = express();

const cors = require('cors');

const productsCtrl = require("./controller/ProductController");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
// app.use(cors({ origin: "https://www.hifurdez.studio/" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("<html> <img src='https://ik.imagekit.io/amnd3xdhd/316166119_526826592671589_9115068966916421847_n.png?ik-sdk-version=javascript-1.4.3&updatedAt=1669486983800' style='height: 100%'></html>");
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
