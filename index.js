const express = require("express");
const app = express();
const cors = require("cors");
const productsCtrl = require("./controller/ProductController");
const address = require("./controller/AddressController");
const adminCtrl = require("./controller/AdminController");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://www.hifurdez.studio",
    "https://testfehifurdez.vercel.app",
  ],
  credentials: true,
  method: ["GET", "PUT", "POST"],
  allowedHeaders: [
    "Origin",
    "X-CSRF-Token",
    "X-Requested-With",
    "Accept",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Content-Type",
    "Date",
    "X-Api-Version",
    "Authorization",
  ],
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.options("/", cors(corsOptions));
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
// GET - admin user
app.route("/admin/users").get(adminCtrl.users);

// POST - admin user with params {id}
app.route("/admin/users/detail").post(adminCtrl.usersDetail);

// PUT - admin block user with params {id}
app.route("/admin/users").put(adminCtrl.changeStatus);

// GET - admin products
app.route("/admin/products").get(adminCtrl.products);

// POST - admin products with params {product_id}
app.route("/admin/products/detail").post(adminCtrl.productsDetail);

// GET - admin purchase order
app.route("/admin/order/sale").get(adminCtrl.sale);

// POST - admin purchase order with params {po_id}
app.route("/admin/order/sale/detail").post(adminCtrl.saleDetail);

// GET - admin purchase order
app.route("/admin/order/purchase").get(adminCtrl.purchase);

// POST - admin purchase order with params {po_id}
app.route("/admin/order/purchase/detail").post(adminCtrl.purchaseDetail);

// GET - admin third party logistic
app.route("/admin/3pls").get(adminCtrl.thirdParty);

// POST - admin third party logistic with params {3pls_id}
app.route("/admin/3pls/detail").post(adminCtrl.thirdPartyDetail);

// GET - admin third party logistic employee
app.route("/admin/3plse").get(adminCtrl.thirdPartyEmployee);

// POST - admin third party logistic employee with params {employee_id}
app.route("/admin/3plse/detail").post(adminCtrl.thirdPartyEmployeeDetail);

// GET - admin warehouse
app.route("/admin/warehouse").get(adminCtrl.warehouse);

// POST - admin warehouse with params {warehouse_id}
app.route("/admin/warehouse/detail").post(adminCtrl.warehouseDetail);

//////////////////////////////////////////////////////////////////////
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started running on " + port);

});
