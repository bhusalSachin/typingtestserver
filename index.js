const port = process.env.PORT || 5000;

const server = require("http").createServer((req, res) => {
  res.end("Hello world");
});

const io = require("socket.io")(server, {
  transports: ["websocket", "polling"],
});

const users = {};

io.on("connection", (client) => {
  console.log("Connected");

  client.on("hello", (message) => {
    io.emit("gotit", message);
  });
});

server.listen(port, () => {
  console.log("running on 5000");
});
