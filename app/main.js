const net = require("net");
const fs = require("fs");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const args = {};
process.argv.forEach((arg, index) => {
  if (arg.startsWith("--")) {
    args[arg.replace(/^--/, "")] = process.argv[index + 1];
  }
});

const directory = args["directory"];

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const full_request = data.toString().split("\r\n");
    
    const headers = {};
    full_request.slice(1).forEach((header) => {
	const [key, value] = header.split(" ");
	if (key && value) {
	  headers[key] = value;
	}
    });

    const parsedData = full_request[full_request.length - 1]

    console.log(headers);
    
    const [method, path, version] = full_request[0].split(" ");
    console.log(method);
    console.log(path);
    console.log(version);

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
	  } else {
	    const file = fs.readFileSync(directory + filePath);
	    const httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${file.length}\r\n\r\n${file}`
	    socket.write(httpResponse);
	  }

	} else {
	  const httpResponse = "HTTP/1.1 404 Not Found\r\n\r\n";
	  socket.write(httpResponse);
	}
    } else if (method == "POST") {
	const filePath = path.split("/files/")[1];
	fs.writeFileSync((directory + filePath), parsedData);
	socket.write("HTTP/1.1 201 Created\r\n\r\n");
    }

    socket.end();
  });

  socket.on("close", () => {
    socket.end();
  });

});

server.listen(4221, "localhost");
