const path = require("path");
const username = "postgres";
const password = "admin";
const host = "localhost";
const port = 15432;

// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: host,
      port: port,
      user: username,
      password: password,
      database: "postgres",
    },
    migrations: {
      directory: path.join(__dirname, "/db/migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "/db/seeds"),
    },
  },
};
