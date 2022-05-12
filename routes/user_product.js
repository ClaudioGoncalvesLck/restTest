// RELATION ROUTES
var express = require("express");
var router = express.Router();
const user_productController = require("../controllers/user_productController ");

router.post("/user/:user_id/product/:product_id", async (req, res, next) => {
  user_productController.user__product_create(req, res, next);
});

// removes every instance of a product from user or specified amount
router.delete("/user/:user_id/product/:product_id", async (req, res, next) => {
  user_productController.user_product_delete(req, res, next);
});

// TODO refactor query
router.get("/user/:user_id/products", async (req, res, next) => {
  user_productController.user_product_get(req, res, next);
});

module.exports = router;
