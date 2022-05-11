var express = require("express");
var router = express.Router();
// var auth = require("../middleware/auth");

const knex = require("../db/knex");

const { Model, ValidationError } = require("objection");
const { User } = require("../models/User");
Model.knex(knex);

//HELPER FUNCTIONS
const { inputValidationErrorHandler } = require("../utils/helper");

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const foundUsers = await User.query().select(
      "id",
      "name",
      "email",
      "created_at",
      "updated_at"
    );
    if (foundUsers.length === 0) {
      return res.status(404).send({ message: "Users not found" });
    }

    res.status(200).send(foundUsers);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(inputValidationErrorHandler(error));
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
    res.status(201).send({ message: "User created" });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(inputValidationErrorHandler(error));
    }

    console.log(error);
  }
});

// GET USER
router.get("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const foundUser = await User.query()
      .select("id", "name", "email", "created_at", "updated_at")
      .from("users")
      .where("id", "=", user_id);
    if (foundUser.length === 0) {
      return res.status(404).send({ message: "User not found" });
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
    const deletedUser = await User.query()
      .deleteById(user_id)
      .returning("name", "email");

    // returns undefined if user doesn't exist
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
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

    // returns undefined if user doesn't exist
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "User updated", updatedUser });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(inputValidationErrorHandler(error));
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
    return res.status(404).send({ message: "User not found" });
  }

  const foundProduct = await User.query()
    .select()
    .from("products")
    .where("id", "=", product_id);
  if (foundProduct.length === 0) {
    return res.status(404).send({ message: "Product not found" });
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

// removes every instance of a product from user
router.delete("/:user_id/product/:product_id/:limit?", async (req, res) => {
  const product_id = req.params.product_id;
  const user_id = req.params.user_id;

  try {
    const foundUser = await User.query().findById(user_id);
    if (!foundUser) {
      return res.status(404).send({ message: "User not found" });
    }

    // if specified, will remove only x instances of a product from a user
    if (req.params.limit) {
      const limit = req.params.limit;

      // postgres doesn't allow limits on deletes
      const removedProductLines = await User.query()
        .select()
        .from("user_product")
        .delete()
        .whereIn(
          "id",
          User.query()
            .select("id")
            .from("user_product")
            .where("user_id", "=", user_id)
            .andWhere("product_id", "=", product_id)
            .limit(limit)
        );

      return res.send({
        message: `Lowered product amount by ${removedProductLines}`,
      });
    }

    const removedProductFromUser = await User.relatedQuery("products")
      // returns number of affected items
      .for(user_id)
      .unrelate()
      .where("products.id", "=", product_id);

    if (!removedProductFromUser) {
      return res
        .status(404)
        .send({ message: "User doesn't have this product" });
    }

    res.status(200).send({ message: "Removed products from user" });
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
      return res.status(404).send({ message: "User not found" });
    }
    // Maybe refactor this to use objection
    const userProducts = await knex.select(
      knex.raw(
        "* FROM products JOIN (select product_id, count(product_id) from user_product where user_id = ? group by product_id) as amount ON products.id = amount.product_id",
        [user_id]
      )
    );

    if (userProducts.length === 0) {
      return res.status(404).send({ message: "User has no products" });
    }

    // Query above returns each product object with "product_id" and "count", this just removes the duplicate product_id
    for (let i = 0; i < userProducts.length; i++) {
      const element = userProducts[i];
      delete element.product_id;
    }

    res.status(200).send(userProducts);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
