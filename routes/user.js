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
router.get("/", async (req, res, next) => {
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

    next(error);
  }
});

// CREATE USER
router.post("/", async (req, res, next) => {
  const newUserInfo = req.query;

  try {
    const createdUser = await User.query().insert(newUserInfo).returning("*");
    const sendUser = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      created_at: createdUser.created_at,
    };

    res.status(201).send({ message: "User created", user: sendUser });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(inputValidationErrorHandler(error));
    }

    next(error);
  }
});

// GET USER
router.get("/:user_id", async (req, res, next) => {
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
    next(error);
  }
});

// DELETE USER
router.delete("/:user_id", async (req, res, next) => {
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
    next(error);
  }
});

// UPDATE
router.patch("/:user_id", async (req, res, next) => {
  const userInfo = req.query;
  const user_id = req.params.user_id;

  try {
    const updatedUser = await User.query()
      .findById(user_id)
      .patch(userInfo)
      .returning("name", "email");

    // returns undefined if user doesn't exist
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "User updated", updatedUser });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(inputValidationErrorHandler(error));
    }

    next(error);
  }
});

// RELATION ROUTES
router.post("/:user_id/product/:product_id", async (req, res, next) => {
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
    await User.relatedQuery("products").for(user_id).relate(product_id);
    res
      .status(201)
      .send({ message: "Added product to user", product: foundProduct[0] });
  } catch (error) {
    next(error);
  }
});

// removes every instance of a product from user or specified amount
router.delete("/:user_id/product/:product_id", async (req, res, next) => {
  const product_id = req.params.product_id;
  const user_id = req.params.user_id;

  try {
    const foundUser = await User.query().findById(user_id);

    if (!foundUser) {
      return res.status(404).send({ message: "User not found" });
    }

    // if specified, will remove only x instances of a product from a user
    if (req.query.limit) {
      const limit = req.query.limit;
      const removedProductLines = await User.query() // postgres doesn't allow limits on deletes
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
    next(error);
  }
});

// TODO refactor query
router.get("/:user_id/products", async (req, res, next) => {
  const user_id = req.params.user_id;

  try {
    const foundUser = await User.query().findById(user_id);

    if (!foundUser) {
      return res.status(404).send({ message: "User not found" });
    }

    // https://knexjs.org/#Raw-Expressions
    const userProducts = await knex.select(
      // Maybe refactor this to use objection
      knex.raw(
        "* FROM products JOIN (select product_id, count(product_id) from user_product where user_id = ? group by product_id) as amount ON products.id = amount.product_id",
        [user_id]
      )
    );

    if (userProducts.length === 0) {
      return res.status(404).send({ message: "User has no products" });
    }

    // Query above returns each product object with "product_id" and "count", this just removes the duplicate product_id
    const sendUserProducts = userProducts.map(({ product_id, ...rest }) => {
      return rest;
    });

    res.status(200).send(sendUserProducts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
