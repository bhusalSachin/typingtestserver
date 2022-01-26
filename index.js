const express = require("express");
const Room = require("./models/room");
const roomRouter = require("./routes/room");
require("./models/db");
const cors = require("cors");

const port = process.env.PORT || 5000;

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  transports: ["websocket"],
});
app.use(cors());

app.use(express.json());
app.use(roomRouter);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to the app server" });
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  next();
});

io.on("connection", (socket) => {
  console.log("Connected");

  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("roomCreated", async (roomId) => {
    const isRoomExist = await Room.findOne({ roomId });
    if (isRoomExist) return;
    const room = await Room({ roomId });
    await room.save();
  });

  socket.on("playerentered", async (data) => {
    const { roomId, username } = data;
    io.emit("newplayer", username);

    const room = await Room.findOne({ roomId });

    io.emit("allplayers", room.players);
  });

  socket.on("testcomplete", async (data) => {
    const { roomId, username, wpm, accuracy } = data;

    const room = await Room.findOne({ roomId });
    const player = room.players.find((elem) => elem.username === username);
    room.players.splice(room.players.indexOf(player), 1, {
      username,
      wpm,
      accuracy,
    });
    await room.save();
    io.emit("testcomplete", { username, wpm, accuracy });
  });

  socket.on("onstart", () => {
    console.log("onstarted clicked");
    io.emit("started");
  });
});

server.listen(port, () => {
  console.log("running on 5000");
});
