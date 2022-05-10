var express = require("express");
var router = express.Router();
const knex = require("../db/knex");
const { Model, ValidationError } = require("objection");
const { User } = require("../models/User");

Model.knex(knex);

// GET ALL USERS
router.get("/", async (req, res) => {
  const result = await knex.select().table("users");

  if (result.length === 0) {
    res.status(404).send({ message: "No users found" });
  } else {
    res.send(result);
  }
});

// CREATE USER
router.post("/", async (req, res) => {
  const user = req.query;
  if (!validateEntityInfo(user, "name")) {
    res.status(400).send({ message: "Missing user information" });
  } else {
    const result = await knex("users").insert(user).returning("*");
    res.status(201).send(result);
  }
});

// GET USER
router.get("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const result = await knex("users").where({ id: user_id }).select();

  if (result.length === 0) {
    res.status(404).send({ message: "User not found" });
  } else {
    res.send(result);
  }
});

// DELETE USER
router.delete("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const result = await knex("users")
    .where({ id: user_id })
    .del()
    .returning("*");
  if (result.length === 0) {
    res.status(404).send({ message: "User not found" });
  } else {
    res.status(200).send({ message: "User deleted", result });
  }
});

// UPDATE
router.patch("/:user_id", async (req, res) => {
  const userInfo = req.query;

  if (!validateEntityInfo(userInfo, "name")) {
    res.status(400).send({ message: "Missing user information" });
  } else {
    const user_id = req.params.user_id;
    const result = await knex("users")
      .where({ id: user_id })
      .update(userInfo)
      .returning("*");

    if (result.length === 0) {
      res.status(404).send({ message: "User not found" });
    } else {
      res.status(200).send({ messsage: "User updated", result });
    }
  }
});

// RELATION ROUTES
router.post("/:user_id/product/:product_id", async (req, res) => {
  const product_id = req.params.product_id;
  const user_id = req.params.user_id;

  // CHANGE TO SINGLE QUERY???
  const product = await knex("products").where({ id: product_id });
  const user = await knex("users").where({ id: user_id });

  if (user.length == 0 || product.length == 0) {
    res.status(404).send({ message: "Product or user doesn't exist" });
  } else {
    const result = await knex("user_product").insert(req.params).returning("*");
    res.status(201).send({ message: "Produto adicionado com sucesso", result });
  }
});

router.delete("/:user_id/product/:product_id", async (req, res) => {
  const product_id = req.params.product_id;
  const user_id = req.params.user_id;

  const result = await knex("user_product")
    .where({ product_id: product_id, user_id: user_id })
    .del()
    .returning("*");
  if (result.length === 0) {
    res.status(404).send({ message: "Product not found" });
  } else {
    res.status(200).send({ message: "Product deleted from user", result });
  }
});

router.get("/:user_id/products", async (req, res) => {
  const user_id = req.params.user_id;
  const user = await knex("users").where({ id: user_id });

  if (user.length === 0) {
    res.status(404).send({ message: "User not found" });
  } else {
    // SELECT * FROM products JOIN (select product_id, count(product_id) from user_product where user_id = 6001 group by product_id) as amount ON products.id = amount.product_id
    const userProducts = await knex.select(
      knex.raw(
        "* FROM products JOIN (select product_id, count(product_id) from user_product where user_id = ? group by product_id) as amount ON products.id = amount.product_id",
        [user_id]
      )
    );
    if (userProducts.length === 0) {
      res.status(404).send({ message: "User has no products" });
    } else {
      res.status(200).send(userProducts);
    }
  }
});

module.exports = router;
