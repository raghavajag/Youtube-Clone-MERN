const mongoose = require("mongoose");
const SubscriberSchema = new mongoose.Schema(
  {
    userTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    userFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
module.exports = Subscriber = mongoose.model("subscriber", SubscriberSchema);
