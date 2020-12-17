const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  // unique = true, stands for the unique user, only one.
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // unique links for each user
  links: [{ type: Types.ObjectId, ref: "Link" }],
});

module.exports = model("User", schema);
