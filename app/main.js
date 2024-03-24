const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();

    console.log("Request: ", request);

    request.split(" ")[1] === "/"
      ? socket.write("HTTP/1.1 200 OK \n\r\n\r")
      : socket.write("HTTP/1.1 404 Not Found \n\r\n\r");
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

console.log("Server listening on port 4221");
server.listen(4221, "localhost");
