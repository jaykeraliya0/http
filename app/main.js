const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    console.log(request);
    const path = data.toString().split("\r\n")[0].split(" ")[1];

    if (path === "/") {
      socket.write("HTTP/1.1 200 OK \r\n\r\n");
    } else if (path.startsWith("/echo/")) {
      const message = path.split("/echo/")[1];
      const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${message.length}\r\n\r\n${message}`;
      socket.write(response);
    } else if (path === "/user-agent") {
      const userAgent = request.split("User-Agent: ")[1].split("\r\n")[0];
      const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
      socket.write(response);
    } else {
      socket.write("HTTP/1.1 404 Not Found \r\n\r\n");
    }

    socket.end();
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

console.log("Server listening on port 4221");
server.listen(4221, "localhost");
