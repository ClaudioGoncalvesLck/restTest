const username = "postgres";
const password = "admin";
const host = "localhost";
const port = 15432;

const pgp = require("pg-promise")(/* options */);
const db = pgp(`postgresql://${username}:${password}@${host}:${port}/postgres`);

module.exports = db;
