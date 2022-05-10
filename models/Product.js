"use strict";

const { Model } = require("objection");
const path = require("path");

class Product extends Model {
  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static tableName = "products";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "price"],

      properties: {
        name: { type: "string", minLength: 2, maxLength: 25 },
        price: { type: "string", minLength: 1, maxLength: 6 },
      },
    };
  }

  static relationMappings = {
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, "User"),
      join: {
        from: "products.id",
        through: {
          from: "user_product.user_id",
          to: "user_product.product_id",
        },
        to: "users.id",
      },
    },
  };
}

module.exports = {
  Product,
};
