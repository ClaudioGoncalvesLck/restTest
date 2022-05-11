const faker = require("faker");
const createFakeUser = () => ({
  name: faker.name.findName(),
  email: faker.internet.exampleEmail(),
  password: faker.internet.password(),
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("users").del();
  const fakeUsers = [];
  const fakeUsersAmount = 10000;
  for (let i = 0; i < fakeUsersAmount; i++) {
    fakeUsers.push(createFakeUser());
  }
  await knex("users").insert(fakeUsers);
};
