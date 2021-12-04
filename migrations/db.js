const Knex = require("knex");
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;
// CREATE DATABASE live_bookmarks
// CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
const knex = Knex({
  client: "pg",
  connection: {
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME || "live_bookmarks",
    password: DB_PASSWORD,
    port: DB_PORT || 5432,
  },
});

module.exports = { knex };
