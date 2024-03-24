const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const message = request.split(" ")[1].split("/")[2];

    console.log(request);

    request.split(" ")[1] === "/"
      ? socket.write("HTTP/1.1 200 OK\r\n")
      : request.split(" ")[1].split("/")[1] === "echo"
      ? socket.write(
          "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\n" + message
        )
      : socket.write("HTTP/1.1 404 Not Found\r\n");
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

console.log("Server listening on port 4221");
server.listen(4221, "localhost");
