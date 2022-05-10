var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

const { Model, ValidationError } = require("objection");
const { User } = require("../models/User");

//HELPER FUNCTIONS
const { inputValidationErrorHandler } = require("../utils/helper");

Model.knex(knex);

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const foundUsers = await User.query();
    if (!foundUsers) {
      res.status(404).send({ message: "Users not found" });
      return;
    }

    res.status(200).send(users);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).send(inputValidationErrorHandler(error));
      return;
    }

    console.log(error);
  }
});

// CREATE USER
router.post("/", async (req, res) => {
  const newUserInfo = req.query;

  try {
    // TODO check syntax
    await User.query().insert(newUserInfo);
    res.status(201).send({ message: "User created", createdUser });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).send(inputValidationErrorHandler(error));
      return;
    }

    console.log(error);
  }
});

// GET USER
router.get("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const foundUser = await User.query().findById(user_id);
    if (!foundUser) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.status(200).send({ message: "User found", foundUser });
  } catch (error) {
    console.log(error);
  }
});

// DELETE USER
router.delete("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const deletedUser = await User.query().deleteById(user_id).returning("*");
    deletedUser;
    if (!deletedUser) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.status(200).send({ message: "User deleted", deletedUser });
  } catch (error) {
    console.log(error);
  }
});

// UPDATE
router.patch("/:user_id", async (req, res) => {
  const userInfo = req.query;
  const user_id = req.params.user_id;

  try {
    const updatedUser = await User.query()
      .findById(user_id)
      .patch(userInfo)
      .returning("*");

    if (!updatedUser) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.send({ message: "User updated", updatedUser });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).send(inputValidationErrorHandler(error));
      return;
    }

    console.log(error);
  }
});

// RELATION ROUTES
router.post("/:user_id/product/:product_id", async (req, res) => {
  const product_id = req.params.product_id;
  const user_id = req.params.user_id;

  const foundUser = await User.query().findById(user_id);
  if (!foundUser) {
    res.status(404).send({ message: "User not found" });
    return;
  }

  const foundProduct = await User.query().findById(product_id);
  if (!foundProduct) {
    res.status(404).send({ message: "Product not found" });
    return;
  }

  try {
    // TODO check syntax
    await User.relatedQuery("products").for(user_id).relate(product_id);
    // 200 || 201 ?
    res.status(200).send({ message: "Added product to user" });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:user_id/product/:product_id", async (req, res) => {
  const product_id = req.params.product_id;
  const user_id = req.params.user_id;

  try {
    const foundUser = await User.query().findById(user_id);
    if (!foundUser) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const removedProductFromUser = await User.relatedQuery("products")
      .for(user_id)
      .unrelate()
      .where("products.id", "=", product_id)
      .returning("*");
    if (!removedProductFromUser) {
      res.status(404).send({ message: "User doesn't have this product" });
      return;
    }

    res
      .status(200)
      .send({ message: "Removed products from user", removedProductFromUser });
  } catch (error) {
    console.log(error);
  }
});

// TODO refactor
router.get("/:user_id/products", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const foundUser = await User.query().findById(user_id);

    if (!foundUser) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    // Maybe refactor this to use objection
    const userProducts = await knex.select(
      knex.raw(
        "* FROM products JOIN (select product_id, count(product_id) from user_product where user_id = ? group by product_id) as amount ON products.id = amount.product_id",
        [user_id]
      )
    );

    // Query above returns each product object with "product_id" and "count", this just removes the duplicate product_id
    for (let i = 0; i < userProducts.length; i++) {
      const element = userProducts[i];
      delete element.product_id;
    }
    if (userProducts.length === 0) {
      res.status(404).send({ message: "User has no products" });
      return;
    }

    res.status(200).send(userProducts);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
