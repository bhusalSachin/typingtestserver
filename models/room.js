const mongoose = require("mongoose");

const StatSchema = new mongoose.Schema(
  {
    wpm: String,
    accuracy: String,
  },
  { timestamps: true }
);

const PlayerSchema = new mongoose.Schema(
  {
    username: String,
    netWpm: Number,
    netAccuracy: Number,
    stats: [StatSchema],
  },
  { timestamps: true }
);

const RoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    players: [PlayerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", RoomSchema);
