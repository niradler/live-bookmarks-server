module.exports = {
  schema: {
    body: {
      type: "object",
      properties: {
        bookmark: {
          type: "object",
          required: ["title", "url", "html"],
          properties: {
            title: { type: "string" },
            url: { type: "string" },
            html: { type: "string" },
            comment: { type: "string" },
          },
        },
        tags: {
          type: "array",
          default: [],
        },
      },
      required: ["bookmark", "tags"],
    },
    headers: {
      type: "object",
      properties: {
        Authorization: { type: "string" },
      },
      required: ["Authorization"],
    },
  },
};
