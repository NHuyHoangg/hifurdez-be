const express = require("express");
const app = express();
const cors = require("cors");
const productsCtrl = require("./controller/ProductController");
const addressCtrl = require("./controller/AddressController");
const adminCtrl = require("./controller/AdminController");
const authCtrl = require("./controller/AuthController");
const userCtrl = require("./controller/UserController");
const otherCtrl = require("./controller/OtherController");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerAutogen = require("swagger-autogen")();
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



const doc = {
  info: {
    title: "Hifurdez's API",
    description: "API for an ecommerce website",
  },
  schemes: ["https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"];


const swaggerDocument = require('./swagger-output.json');
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);

app.options("/", cors(corsOptions));

app.get("/api-update", (req, res) => {
  swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require("./index.js");
  });
   res.send(
    "complete"
   );
});

app.get("/", (req, res) => {
  res.send(
    "<html> <img src='https://ik.imagekit.io/amnd3xdhd/316166119_526826592671589_9115068966916421847_n.png?ik-sdk-version=javascript-1.4.3&updatedAt=1669486983800' style='height: 100%'></html>"
  );
});

// API ROUTE
// ---------------------------- AUTH - POST ---------------------------------- //
app.route("/auth/sign-in").post(authCtrl.signIn);
app.route("/auth/sign-up").post(authCtrl.signUp);

// ------------------------------ PRODUCT ------------------------------------ //
// COLLECTION - GET - 8 random products by collection.
app.route("/product-random-by-spring").get(productsCtrl.randomBySpring);
app.route("/product-random-by-summer").get(productsCtrl.randomBySummer);
app.route("/product-random-by-autumn").get(productsCtrl.randomByAutumn);
app.route("/product-random-by-winter").get(productsCtrl.randomByWinter);

// ALL PRODUCT - GET - all product.
app.route("/all-product").get(productsCtrl.get);

// GET - 8 random products
app.route("/product-random").get(productsCtrl.random);

// POST - product detail with params {id}.
app.route("/product-by-id").post(productsCtrl.detail);

// ------------------------------ ADDRESS ------------------------------------- //
// GET - all province
app.route("/province").get(addressCtrl.province);

// POST - all district with params {province_id}.
app.route("/province/district").post(addressCtrl.district);

// POST - all district with params {district_id}.
app.route("/province/district/ward").post(addressCtrl.ward);

// -------------------------------- ADMIN -------------------------------------- //
// GET - admin user
app.route("/admin/users").get(adminCtrl.users);

// POST - admin user with params {id}
app.route("/admin/users/detail").post(adminCtrl.usersDetail);

// PUT - admin change user status with params {user_id}
app.route("/admin/users/change-status").put(adminCtrl.userChangeStatus);

// GET - admin products
app.route("/admin/products").get(adminCtrl.products);

// POST - admin products with params {product_id}
app.route("/admin/products/detail").post(adminCtrl.productsDetail);

// PUT - admin change product status with params {product_id}
app.route("/admin/products/change-status").put(adminCtrl.productChangeStatus);

// POST - admin update products's info with params {product_id}
app.route("/admin/products/update-info").put(adminCtrl.updateProduct);

// PUT - admin add new product with params {product_id}
app.route("/admin/products/add-new").put(adminCtrl.addNewProduct);

// GET - admin sale order
app.route("/admin/order/sale").get(adminCtrl.sale);

// PUT - admin sale order update status with params {so_id}
app.route("/admin/order/sale/status").put(adminCtrl.updateSaleStatus);

// POST - admin sale order with params {so_id}
app.route("/admin/order/sale/detail").post(adminCtrl.saleDetail);

// GET - admin purchase order
app.route("/admin/order/purchase").get(adminCtrl.purchase);

// PUT - admin purchase order update status with params {so_id}
app.route("/admin/order/purchase/status").put(adminCtrl.updatePurchaseStatus);

// POST - admin purchase order with params {po_id}
app.route("/admin/order/purchase/detail").post(adminCtrl.purchaseDetail);

// GET - admin third party logistic
app.route("/admin/3pls").get(adminCtrl.thirdParty);

// POST - admin third party logistic with params {3pls_id}
app.route("/admin/3pls/detail").post(adminCtrl.thirdPartyDetail);

// PUT - admin change 3pls status with params {3pls_id}
app.route("/admin/3pls/change-status").put(adminCtrl.thirdPartyChangeStatus);

// GET - admin third party logistic employee
app.route("/admin/3plse").get(adminCtrl.thirdPartyEmployee);

// POST - admin third party logistic employee with params {employee_id}
app.route("/admin/3plse/detail").post(adminCtrl.thirdPartyEmployeeDetail);

// PUT - admin change 3pls status with params {3plse_id}
app
  .route("/admin/3plse/change-status")
  .put(adminCtrl.thirdPartyEmployeeChangeStatus);

// GET - admin warehouse
app.route("/admin/warehouse").get(adminCtrl.warehouse);

// POST - admin warehouse with params {warehouse_id}
app.route("/admin/warehouse/detail").post(adminCtrl.warehouseDetail);

// PUT - admin change warehouse status with params {warehouse_id}
app
  .route("/admin/warehouse/change-status")
  .put(adminCtrl.warehouseChangeStatus);

// -------------------------------- USER -------------------------------------- //
// POST - user get user's info with params {user_id}
app.route("/user/get-info").post(userCtrl.getInfo);

// POST - user confirm user's password with params {user_id, password}
app.route("/user/confirm-password").post(userCtrl.confirmUserPassword);

// PUT - user change info with params {fullname, username, email, password, phone, street, ward_id, district_id, province_id}
app.route("/user/change-info").put(userCtrl.changeInfo);

// PUT - user change image with params {id, image}
// app.route("/user/change-image").put(userCtrl.changeImage);

// POST - admin sale order with params {id}
app.route("/user/order").post(userCtrl.userSale);

// POST - admin sale order with params {po_id}
app.route("/user/order/detail").post(userCtrl.userSaleDetail);

// -------------------------------- OTHERS -------------------------------------- //
// POST - search in navbar with params {stringName}
app.route("/search").post(otherCtrl.navBarSearch);

// POST - insert cart with params {customer_id, product_id}
app.route("/cart/insert").post(otherCtrl.insertCart);

// POST - insert cart with params {customer_id, product_id}
app.route("/cart/update").post(otherCtrl.updateCart);

// POST - get cart with params {customer_id}
app.route("/cart/get").post(otherCtrl.getCart);

// POST - get checkout with params {customer_id}
app.route("/cart/checkout").post(otherCtrl.checkout);

// POST - get payup with params {customer_id}
app.route("/cart/payup").post(otherCtrl.payup);
//////////////////////////////////////////////////////////////////////
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started running on " + port);
});
