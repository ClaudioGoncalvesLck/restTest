const knex = require("../db/knex");
const { Model } = require("objection");
const { User } = require("../models/User");

Model.knex(knex);

exports.user__product_create = async (req, res, next) => {
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
};

exports.user_product_delete = async (req, res, next) => {
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
};

exports.user_product_get = async (req, res, next) => {
  const user_id = req.params.user_id;

  try {
    const foundUser = await User.query().findById(user_id);

    if (!foundUser) {
      return res.status(404).send({ message: "User not found" });
    }

    // https://knexjs.org/#Raw-Expressions
    const userProducts = await knex.select(
      knex.raw(
        "* FROM products JOIN (select product_id, count(product_id) from user_product where user_id = ? group by product_id) as amount ON products.id = amount.product_id",
        [user_id]
      )
    );

    if (userProducts.length === 0) {
      return res.status(404).send({ message: "User has no products" });
    }

    // Query above returns each product object with "product_id" and "count",
    // this just removes the duplicate product_id
    const sendUserProducts = userProducts.map(({ product_id, ...rest }) => {
      return rest;
    });

    res.status(200).send(sendUserProducts);
  } catch (error) {
    next(error);
  }
};
