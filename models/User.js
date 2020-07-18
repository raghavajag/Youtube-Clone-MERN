const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
});
module.exports = User = mongoose.model("user", UserSchema);
