const server = require("http").createServer((req, res) => {
  res.end("Hello world");
});

const io = require("socket.io")(server, {
  transports: ["websocket", "polling"],
});

const users = {};

io.on("connection", (client) => {
  console.log("Connected");
});

server.listen(5000, () => {
  console.log("running on 5000");
});
