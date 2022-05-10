const faker = require("faker");
const createFakeProduct = () => ({
  name: faker.commerce.productName(),
  price: faker.commerce.price(1, 500, 2),
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("products").del();
  const fakeProducts = [];
  const fakeProductsAmount = 10000;
  for (let i = 0; i < fakeProductsAmount; i++) {
    fakeProducts.push(createFakeProduct());
  }
  await knex("products").insert(fakeProducts);
};
