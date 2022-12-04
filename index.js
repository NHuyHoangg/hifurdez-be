const express = require("express");
const cors = require("cors");
const productsCtrl = require("./controller/ProductController");
const address = require("./controller/AddressController");
const adminCtrl = require("./controller/AdminController");

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://www.hifurdez.studio/"],
  credentials: true,
  // access-control-allow-credentials:true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send(
    "<html> <img src='https://ik.imagekit.io/amnd3xdhd/316166119_526826592671589_9115068966916421847_n.png?ik-sdk-version=javascript-1.4.3&updatedAt=1669486983800' style='height: 100%'></html>"
  );
});

// API ROUTE
// AUTH - POST
app.use("/server/auth", require("./controller/AuthController"));

// COLLECTION - GET - 8 random products by collection.
app.route("/product-random-by-spring").get(productsCtrl.randomBySpring);
app.route("/product-random-by-summer").get(productsCtrl.randomBySummer);
app.route("/product-random-by-autumn").get(productsCtrl.randomByAutumn);
app.route("/product-random-by-winter").get(productsCtrl.randomByWinter);

// ALL PRODUCT - GET - all product.
app.route("/all-product").get(productsCtrl.get);

// PRODUCT DETAIL
// GET - 8 random products
app.route("/product-random").get(productsCtrl.random);

// POST - product detail with params {id}.
app.route("/product-by-id").post(productsCtrl.detail);

// ADDRESS
// GET - all province
app.route("/province").get(address.province);

// POST - all district with params {province_id}.
app.route("/province/district").post(address.district);

// POST - all district with params {district_id}.
app.route("/province/district/ward").post(address.ward);

// ADMIN
// GET - admin products
app.route("/admin/products").get(adminCtrl.products);

// POST - admin products with params {product_id}
app.route("/admin/products/detail").post(adminCtrl.productsDetail);

// GET - admin purchase order
app.route("/admin/order/purchase").get(adminCtrl.purchase);

// POST - admin purchase order with params {po_id}
app.route("/admin/order/purchase/detail").post(adminCtrl.purchaseDetail);

//////////////////////////////////////////////////////////////////////
app.listen("3001", () => {
  console.log("server started running on 3001");
});
