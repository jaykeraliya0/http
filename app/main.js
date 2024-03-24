const net = require("net");
const fs = require("fs");
const path = require("path");

const server = net.createServer(async (socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    console.log(request);
    const reqPath = data.toString().split("\r\n")[0].split(" ")[1];

    if (reqPath === "/") {
      socket.write("HTTP/1.1 200 OK \r\n\r\n");
    } else if (reqPath.startsWith("/echo/")) {
      const message = reqPath.split("/echo/")[1];
      const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${message.length}\r\n\r\n${message}`;
      socket.write(response);
    } else if (reqPath === "/user-agent") {
      const userAgent = request.split("User-Agent: ")[1].split("\r\n")[0];
      const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
      socket.write(response);
    } else if (reqPath.startsWith("/files/")) {
      const dir = process.argv[2] === "--directory" ? process.argv[3] : null;
      const fileName = reqPath.split("/files/")[1];
      const filePath = path.join(dir, fileName);

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);
        const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${fileContent.length}\r\n\r\n${fileContent}`;
        socket.write(response);
      } else {
        socket.write("HTTP/1.1 404 Not Found \r\n\r\n");
      }
    } else {
      socket.write("HTTP/1.1 404 Not Found \r\n\r\n");
    }

    socket.end();
  });

  socket.on("close", () => {
    socket.end();
  });
});

console.log("Server listening on port 4221");
server.listen(4221, "localhost");
