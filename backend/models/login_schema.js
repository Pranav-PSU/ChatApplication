// This is our schema for a user in our database.

const mongoose = require("mongoose");


// The user may need a UUID later, so we include that.
const user_schema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  uuid: {type: String, required: true, unique: true}, 
});

const model = mongoose.model('user_model', user_schema);
module.exports = model;

