require("dotenv").config();
const { knex } = require("./db");

const createTagsSchema = async () => {
  return knex.schema.hasTable("tags").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("tags", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid_generate_v4())"));
        table.string("name").notNullable().unique();
        table.timestamp("created_at").defaultTo(knex.fn.now());
      });
    }
  });
};
const createBookmarkSchema = async () => {
  return knex.schema.hasTable("bookmarks").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("bookmarks", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid_generate_v4())"));
        table.string("title").notNullable();
        table.string("url").notNullable().unique();
        table.string("html").notNullable();
        table.string("comment");
        table.timestamp("created_at").defaultTo(knex.fn.now());
      });
    }
  });
};
const createBookmarkTagSchema = async () => {
  return knex.schema.hasTable("bookmark_tag").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("bookmark_tag", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("(uuid_generate_v4())"));
        table.uuid("bookmark").notNullable();
        table.uuid("tag").notNullable();
        table.foreign("bookmark").references("id").inTable("bookmarks");
        table.foreign("tag").references("id").inTable("tags");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.unique(["bookmark", "tag"]);
      });
    }
  });
};

const main = async () => {
  try {
    await createTagsSchema();
    await createBookmarkSchema();
    await createBookmarkTagSchema();
    console.log("Migration complete");
    process.exit(0);
  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1);
  }
};
main();
