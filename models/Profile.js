const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
    maxlength: 200,
  },
  fieldofintrest: {
    type: String,
  },
  description: {
    type: String,
  },

  twitter: {
    type: String,
  },
  facebook: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  instagram: {
    type: String,
  },
  githubusername: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  profileImage: {
    type: String,
    default: "http://localhost:5000/api/profile/image/noimage.png",
  },
});
module.exports = User = mongoose.model("profile", ProfileSchema);
