const server = require("http").createServer();

const io = require("socket.io")(server, {
  transports: ["websocket", "polling"],
});

const users = {};

io.on("connection", (client) => {
  console.log("Connected");
});
