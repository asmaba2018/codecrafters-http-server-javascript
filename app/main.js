const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const flags = process.argv.slice(2);
const directory = flags.find((_, index) => flags[index - 1] == "--directory");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const [request, host, agent] = data.toString().split("\r\n");

    const [method, path, version] = request.split(" ");

    if (method == "GET") {
	if (path == "/") {
	  const httpResponse = "HTTP/1.1 200 OK\r\n\r\n";
	  socket.write(httpResponse);
	} else if (path.startsWith("/echo/")) {
	  const content = path.split("/echo/")[1];
	  // console.log(content);
	  const httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`;
	  socket.write(httpResponse);
	} else if (path == ("/user-agent")) {
	  const userAgent = agent.split("User-Agent: ")[1];
	  // console.log(userAgent);
	  const httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
	  socket.write(httpResponse);
	} else if (path.startsWith("/files/")){
	  const filePath = path.split("/files/")[1];
	  if(!fs.existsSync(directory + filePath)){
	    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
	    socket.end();
	  } else {
		const file = fs.readFileSync(directory + filePath);
		const httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${file.length}\r\n\r\n${file}`
		socket.write(httpResponse);
            }
	  }
	} else {
	  const httpResponse = "HTTP/1.1 404 Not Found\r\n\r\n";
	  socket.write(httpResponse);
    }

    socket.end();
  });

  socket.on("close", () => {
    socket.end();
  });

});

server.listen(4221, "localhost");
