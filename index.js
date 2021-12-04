require("dotenv").config();
const app = require("fastify")({
  logger: true,
});
const { createBookmarkOpts } = require("./schemas");
const dbConnector = require("./plugins/knex-db-connector");
const { PORT, API_KEY } = process.env;

const main = async () => {
  try {
    await app.register(dbConnector);
    await app.register(require("fastify-express"));
    app.use((req, res, next) => {
      const key = req.headers.Authorization || req.headers.authorization;
      if (key === API_KEY) {
        next();
      } else {
        res.status(401).send("Unauthorized");
      }
    });

    app.get("/tags", async (req, res) => {
      const limit = req.query.limit || 10;
      const offset = req.query.offset || 0;
      const tags = await app.db
        .column("name")
        .select()
        .from("tags")
        .limit(limit)
        .offset(offset);

      const count = await app.db.count().from("tags");

      return { data: tags, count: count[0].count, limit, offset };
    });

    app.post("/tag", async (req, res) => {
      const tag = await app.db.insert(req.body).returning("id").into("tags");

      return { data: tag };
    });

    app.get("/bookmarks", async (req, res) => {
      const limit = req.query.limit || 10;
      const offset = req.query.offset || 0;
      const q = app.db
        .column("title", "url", "comment")
        .select()
        .from("bookmarks");

      const qc = app.db.count().from("bookmarks");
      if (req.query.q) {
        q.where("title", "like", `%${req.query.q}%`);
        qc.where("title", "like", `%${req.query.q}%`);
      }
      const bookmark = await q.limit(limit).offset(offset);

      const count = await qc;
      return { data: bookmark, count: count[0].count, limit, offset };
    });

    app.post("/bookmark", createBookmarkOpts, async (req, res) => {
      app.log.info(`Bookmark request received: ${JSON.stringify(req.body)}`);
      const bookmark = await app.db
        .insert(req.body.bookmark)
        .returning("id")
        .into("bookmarks")
        .onConflict("url")
        .merge();
      console.log({ bookmark });

      const tags = await app.db
        .insert(req.body.tags.map((tag) => ({ name: tag.toLowerCase() })))
        .returning("id")
        .into("tags")
        .onConflict("name")
        .merge();
      console.log({ tags: tags });

      await app.db.raw(
        `? ON CONFLICT (tag, bookmark)
              DO NOTHING
              RETURNING *;`,
        [
          app.db
            .insert(
              req.body.tags.map((tag, i) => ({
                tag: tags[i],
                bookmark: bookmark[0],
              }))
            )
            .into("bookmark_tag"),
        ]
      );

      res.type("application/json").code(200);

      return { data: { bookmark, tags } };
    });

    const port = PORT || 3033;
    app.listen(port, (err, address) => {
      if (err) throw err;
      console.log(`App running on ${address}`);
    });
  } catch (error) {
    app.log.error(error.message);
  }
};
main();
