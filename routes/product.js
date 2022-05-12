var express = require("express");
var router = express.Router();

const productController = require("../controllers/productController");

//GET ALL PRODUCTS
router.get("/product", async (req, res, next) => {
  productController.product_index(req, res, next);
});

//CREATE PRODUCT
router.post("/product", async (req, res, next) => {
  productController.product_create(req, res, next);
});

//GET PRODUCT
router.get("/product/:product_id", async (req, res, next) => {
  productController.product_get(req, res, next);
});

//DELETE PRODUCT
router.delete("/product/:product_id", async (req, res, next) => {
  productController.product_delete(req, res, next);
});

//UPDATE PRODUCT
router.patch("/product/:product_id", async (req, res, next) => {
  productController.product_update(req, res, next);
});

module.exports = router;
