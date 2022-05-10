var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

const { Model, ValidationError } = require("objection");
const { Product } = require("../models/Product");

//HELPER FUNCTIONS
const { inputValidationErrorHandler } = require("../utils/helper");

Model.knex(knex);

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const foundProducts = await Product.query();
    if (!foundProducts) {
      res.status(404).send({ message: "Products not found" });
      return;
    }
    res.status(200).send(products);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).send(inputValidationErrorHandler(error));
      return;
    }

    console.log(error);
  }
});

//CREATE PRODUCT
router.post("/", async (req, res) => {
  const newProductInfo = req.query;

  try {
    const createdProduct = await Product.query().insert(newProductInfo);
    res.status(201).send({ message: "Product created", createdProduct });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).send(inputValidationErrorHandler(error));
      return;
    }

    console.log(error);
  }
});

//GET PRODUCT
router.get("/:product_id", async (req, res) => {
  const product_id = req.params.product_id;

  try {
    const foundProduct = await Product.query().findById(product_id);
    if (!foundProduct) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    res.status(200).send({ message: "Product found", foundProduct });
  } catch (error) {
    console.log(error);
  }
});

//DELETE PRODUCT
router.delete("/:product_id", async (req, res) => {
  const product_id = req.params.product_id;

  try {
    const deletedProduct = await Product.query()
      .deleteById(product_id)
      .returning("*");
    if (!deletedProduct) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    res.status(200).send({ message: "Product deleted", deletedProduct });
  } catch (error) {
    console.log(error);
  }
});

//UPDATE PRODUCT
router.patch("/:product_id", async (req, res) => {
  const productInfo = req.query;
  const product_id = req.params.product_id;

  try {
    const updatedProduct = await Product.query()
      .findById(product_id)
      .patch(productInfo)
      .returning("*");
    if (!updatedProduct) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    res.status(200).send({ message: "Product updated", updatedProduct });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).send(inputValidationErrorHandler(error));
      return;
    }

    console.log(error);
  }
});

module.exports = router;
