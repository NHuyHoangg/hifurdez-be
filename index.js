const express = require("express");
const cors = require("cors");
const productsCtrl = require("./controller/ProductController");
const address = require("./controller/AddressController");
const analytic = require("@vercel/analytics");

analytic.inject();

const app = express();

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

// API ROUTE
// AUTH
app.use("/server/auth", require("./controller/AuthController"));

// GET 8 RANDOM PRODUCTS BY COLLECTION
app.route("/product-random-by-spring").get(productsCtrl.randomBySpring);
app.route("/product-random-by-summer").get(productsCtrl.randomBySummer);
app.route("/product-random-by-autumn").get(productsCtrl.randomByAutumn);
app.route("/product-random-by-winter").get(productsCtrl.randomByWinter);

// GET 8 RANDOM PRODUCTS
app.route("/product-random").get(productsCtrl.random);

// POST PRODUCT DETAIL WITH PARAMS {id}
app.route("/product-by-id").post(productsCtrl.detail);

// GET ALL PRODUCT
app.route("/all-product").get(productsCtrl.get);

// GET ALL PROVINCE
app.route("/province").get(address.province);

// POST ALL DISTRICT WITH PROVINCE_ID WITH PARAMS {id}
app.route("/province/district").post(address.district);

// POST ALL WARD WITH DISTRICT_ID WITH PARAMS {id}
app.route("/province/district/ward").post(address.ward);

app.listen("3001", () => {
  console.log("server started running on 3001");
});
