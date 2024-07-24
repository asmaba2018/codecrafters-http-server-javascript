const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();

    if (request.startsWith("GET /echo/")) {
	const echostr = request.split("/").pop();
	const httpResponse = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: {echostr.length}\r\n\r\n{echostr}";
	socket.write(httpResponse);
    } else if (request.startsWith("GET /")) {
	const httpResponse = "HTTP/1.1 200 OK\r\n\r\n";
	socket.write(httpResponse);
    } else {
	const httpResponse = "HTTP/1.1 404 Not Found\r\n\r\n";
	socket.write(httpResponse);
    }

    socket.end();
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });

});

server.listen(4221, "localhost");
