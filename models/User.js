"use strict";

const { Model } = require("objection");
const path = require("path");

class User extends Model {
  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static tableName = "users";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        name: { type: "string", minLength: 2, maxLength: 20 },
      },
    };
  }

  static relationMappings = {
    products: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, "Product"),
      join: {
        from: "users.id",
        through: {
          from: "user_product.user_id",
          to: "user_product.product_id",
        },
        to: "products.id",
      },
    },
  };
}

module.exports = {
  User,
};
