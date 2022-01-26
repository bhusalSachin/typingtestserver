const Room = require("../models/room");

exports.checkForId = async (req, res) => {
  console.log("got post request");
  const { roomId, username } = req.body;

  console.log(req.body);
  if (!roomId) {
    return res.json({ success: false, message: "No room id typed" });
  }

  try {
    const room = await Room.findOne({ roomId });

    if (room) {
      const isMatched = room.players.find((elem) => elem.username === username);
      console.log(isMatched);
      if (isMatched)
        return res.json({
          success: false,
          message: "Username is already taken by someone else in the room",
        });
      else {
        room.players.push({ username, wpm: "", accuracy: "" });
        await room.save();
      }
      return res.status(200).json({ success: true, message: "Found the room" });
    } else {
      return res.json({ success: false, message: "Didn't find the room" });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};
