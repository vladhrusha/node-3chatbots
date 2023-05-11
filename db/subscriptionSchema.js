const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  userName: { type: String, required: true },
  times: [
    {
      hour: { type: Number, required: true },
      minute: { type: Number, required: true },
    },
  ],
  coordinates: {
    lat: { type: Number },
    lon: { type: Number },
  },
  chatId: { type: Number, required: true },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema, "subs");

module.exports = Subscription;
