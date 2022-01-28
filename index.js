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

  const { user, id } = socket.handshake.query;
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
    player.stats.push({ wpm, accuracy });
    await room.save();
    const allstats = player.stats;
    const length = player.stats.length;
    const netWpm =
      player.stats.reduce((acc, obj) => acc + parseInt(obj.wpm), 0) / length;
    const netAccuracy =
      player.stats.reduce((prev, curr) => prev + parseInt(curr.accuracy), 0) /
      length;
    room.players.splice(room.players.indexOf(player), 1, {
      username,
      netWpm,
      netAccuracy,
      stats: allstats,
    });
    await room.save();
    io.emit("testcomplete", { username, netWpm, netAccuracy });

    room.players.sort((a, b) => {
      if (a.netWpm < b.netWpm) return 1;
      if (a.netWpm > b.netWpm) return -1;
      return 0;
    });
    await room.save();
    io.emit(
      "updatedleader",
      room.players,
      room.players.find((elem) => elem.username === user)
    );
  });

  socket.on("onstart", (text) => {
    console.log("onstarted clicked");
    io.emit("started", text);
  });

  socket.on("disbound", () => {
    socket.leave(id);
  });

  socket.on("alertiscoming", (msg) => {
    io.emit("alertmsg", msg);
  });

  socket.on("disconnect", async () => {
    console.log(user, " disconnected");
    if (user === "host") {
      io.emit("hostleft");
      await Room.findOneAndDelete({ roomId: id });
    }
    const room = await Room.findOne({ roomId: id });
    if (room) {
      const player = room.players.find((elem) => elem.username === user);
      room.players.id(player.id).remove();
      await room.save();
      // const host = room.players.find((elem) => elem.username === "host");
      // room.players.splice(room.players.indexOf(host), 1);
      io.emit("playergone", user, room.players);
    }
  });
});

server.listen(port, () => {
  console.log("running on 5000");
});
