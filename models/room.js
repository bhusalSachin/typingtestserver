const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema(
  {
    username: String,
    wpm: String,
    accuracy: String,
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
