var express = require("express");
var router = express.Router();
const knex = require("../db/knex");
const { validateEntityInfo } = require("../utils/helper");

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const result = await knex.select().table("products");
  if (result.length === 0) {
    res.status(404).send({ message: "No products found" });
  } else {
    res.status(200).send(result);
  }
});

//CREATE PRODUCT
router.post("/", async (req, res) => {
  const productInfo = req.query;

  if (!validateEntityInfo(productInfo, "name", "price")) {
    res.status(400).send({ message: "Missing product information" });
  } else {
    const result = await knex("products").insert(productInfo).returning("*");
    res.status(201).send({ message: "Product created", result });
  }
});

//GET PRODUCT BY ID
router.get("/:product_id", async (req, res) => {
  const product_id = req.params.product_id;
  const result = await knex("products").where({ id: product_id }).select();

  if (result.length === 0) {
    res.status(404).send({ message: "Product not found" });
  } else {
    res.status(200).send(result);
  }
});

//DELETE PRODUCT
router.delete("/:product_id", async (req, res) => {
  const product_id = req.params.product_id;
  const result = await knex("products")
    .where({ id: product_id })
    .del()
    .returning("*");

  if (result.length === 0) {
    res.status(404).send({ message: "Product not found" });
  } else {
    res.status(200).send({ message: "Product deleted" });
  }
});

//UPDATE PRODUCT
router.patch("/:product_id", async (req, res) => {
  const productInfo = req.query;

  if (!validateEntityInfo(productInfo, "name", "price")) {
    res.status(400).send({ message: "Missing product information" });
  } else {
    const product_id = req.params.product_id;
    const result = await knex("products")
      .where({ id: product_id })
      .update(productInfo)
      .returning("*");

    if (result.length === 0) {
      res.status(404).send({ message: "Product not found" });
    }
  }
});

module.exports = router;
