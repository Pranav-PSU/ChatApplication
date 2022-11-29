const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  uuid: {type: String, required: true, unique: true}, 
});

const model = mongoose.model('user_model', user_schema);
module.exports = model;

