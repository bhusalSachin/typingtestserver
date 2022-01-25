const express = require("express");
const Room = require("./models/room");
const roomRouter = require("./routes/room");
require("./models/db");
const cors = require("cors");

const port = process.env.PORT || 5000;

const app = express();

const server = require("http").createServer();

app.use(express.json());
app.use(roomRouter);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  // res.setHeader("Access-Control-Max-Age", "1800");
  // res.setHeader("Access-Control-Allow-Headers", "content-type");
  // res.setHeader(
  //   "Access-Control-Allow-Methods",
  //   "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  // );

  next();
});
// app.use(cors());

io.on("connection", (socket) => {
  console.log("Connected");

  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("roomCreated", async (roomId) => {
    console.log("Room created with id of " + roomId);
    const isRoomExist = await Room.findOne({ roomId });
    if (isRoomExist) return;
    const room = await Room({ roomId });
    await room.save();
  });
});

server.on("request", app);

server.listen(port, () => {
  console.log("running on 5000");
});
