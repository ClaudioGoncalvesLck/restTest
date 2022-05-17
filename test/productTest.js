let chai = require("chai");
let chaiHttp = require("chai-http");
var expect = chai.expect;

const faker = require("faker");
const knex = require("../db/knex");
const { Model } = require("objection");
const { Product } = require("../models/Product");
const res = require("express/lib/response");

Model.knex(knex);

chai.use(chaiHttp);

describe("#getProduct", () => {
  it("gets one product", async () => {
    const product = await Product.query().insert({
      name: `${faker.commerce.productName()}`,
      price: `${faker.commerce.price(1, 500, 2)}`,
    });

    const result = await chai
      .request("localhost:3000")
      .get(`/product/${product.id}`);
    expect(result).to.have.status(200);

    after(async () => {
      await Product.query().deleteById(product.id);
    });
  });
});

describe("#postProduct", () => {
  it("creates a product", async () => {
    const product = {
      name: `${faker.commerce.productName()}`,
      price: `${faker.commerce.price(1, 500, 2)}`,
    };

    const result = await chai
      .request("localhost:3000")
      .post(`/product`)
      .query(product);
    expect(result).to.have.status(201);

    after(async () => {
      await Product.query().deleteById(result.body.createdProduct.id);
    });
  });
});
