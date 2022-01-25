const Room = require("../models/room");

exports.checkForId = async (req, res) => {
  console.log("got post request");
  const { roomId } = req.body;
  if (!roomId) res.json({ success: false, message: "No room id typed1" });

  try {
    const room = await Room.findOne({ roomId });

    if (room) res.json({ success: true, message: "Found the room" });
    else res.json({ success: false, message: "Didn't find the room" });
  } catch (err) {
    res.json({
      success: true,
      message: "Error in finding room. Try entering id again",
    });
  }
};
