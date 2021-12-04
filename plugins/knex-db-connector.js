const fastifyPlugin = require("fastify-plugin");
const Knex = require("knex");
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

// CREATE DATABASE live_bookmarks

const knexConnector = async (server, options = {}) => {
  const db = Knex({
    client: "pg",
    connection: {
      user: DB_USER,
      host: DB_HOST,
      database: DB_NAME || "live_bookmarks",
      password: DB_PASSWORD,
      port: DB_PORT || 5432,
    },
  });
  db.on("query", (query) => {
    console.debug(
      `Executed a query: ${query.__knexQueryUid} =>`,
      query.sql,
      query.bindings
    );
  });
  // .on("query-response", (response, query) => {
  //   console.debug(
  //     `Received a response from: ${query.__knexQueryUid} =>`,
  //     response
  //   );
  // });
  server.decorate("db", db);
};

module.exports = fastifyPlugin(knexConnector);
