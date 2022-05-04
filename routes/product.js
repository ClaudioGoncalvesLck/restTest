var express = require("express");
var router = express.Router();

//TIRAR ISTO DAQUI
const config = require("../db/knexfile")[process.env.NODE_ENV || "development"];
const knex = require("knex")(config);

//GET ALL PRODUCTS
router.get("/", (req, res) => {
  knex
    .select()
    .table("products")
    .then((result) => {
      res.send(result);
    });
});

//CREATE PRODUCT
router.post("/", (req, res) => {
  const product = req.query;
  if (!product.amount) {
    product.amount = 0;
  }
  knex("products")
    .insert(product)
    .returning("*")
    .then((result) => {
      res.status(201).send({ message: "Product created", result });
    })
    .catch((error) => {
      throw new Error(error);
    });
});

//GET PRODUCT BY ID
router.get("/:product_id", (req, res) => {
  const product_id = req.params.product_id;
  knex("products")
    .where({ id: product_id })
    .select()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw new Error(error);
    });
});

//DELETE PRODUCT
router.delete("/:product_id", (req, res) => {
  const product_id = req.params.product_id;
  knex("products")
    .where({ id: product_id })
    .del()
    .returning("*")
    .then((result) => {
      if (Object.keys(result).length === 0) {
        res.status(404).send({ message: "Product not found" });
      } else {
        // SEM O ELSE ESTOURA
        res.status(200).send({ message: "Product deleted", result });
      }
    });
});

//UPDATE PRODUCT
router.patch("/:product_id", (req, res) => {
  const productinfo = req.query;
  const product_id = req.params.product_id;
  knex("products")
    .where({ id: product_id })
    .update(productinfo)
    .returning("*")
    .then((result) => {
      res.status(200).send({ message: "Product updated", result });
    });
});

module.exports = router;
