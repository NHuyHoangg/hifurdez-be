const express = require("express");
const dotenv = require("dotenv");
const { pool } = require("./database/dbinfo");
const cors = require("cors");
const productsCtrl = require("./controller/ProductController");

const app = express();
dotenv.config();

const corsOptions = {
  origin: ["http://localhost:3000", "https://www.hifurdez.studio/"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send(
    "<html> <img src='https://ik.imagekit.io/amnd3xdhd/316166119_526826592671589_9115068966916421847_n.png?ik-sdk-version=javascript-1.4.3&updatedAt=1669486983800' style='height: 100%'></html>"
  );
});

//api route
/**
    Phân route theo từng nhóm
**/

//auth
app.use("/server/auth", require("./controller/AuthController"));

//product
app.route("/product").get(productsCtrl.random);
app.route("/product/:id").get(productsCtrl.detail);
app.route("/products").get(productsCtrl.get);

//
app.listen("3001", () => {
  console.log("server started running on 3001");
});
