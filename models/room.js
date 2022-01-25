const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    ishost: {
      type: Boolean,
      default: false,
      required: true,
    },
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
