const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();

    const url = request.split(" ")[1];
    console.log(url);

    const headers = request.split("\r\n");
    console.log(headers);

    if (url == "/") {
	const httpResponse = "HTTP/1.1 200 OK\r\n\r\n";
	socket.write(httpResponse);
    } else if (url.includes("/echo/")) {
	const content = request.split("/echo/")[1].split(" ")[0];
	// console.log(content);
	const httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`;
	socket.write(httpResponse);
    } else if (url == ("/user-agent")) {
	const userAgent = headers[2].split("User-Agent: ")[1];
	// console.log(userAgent);
	const httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
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
