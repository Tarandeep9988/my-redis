const net = require("net");

const server = net.createServer((connection) => {
  console.log("Client connected");
})


const PORT = 8000;

server.listen(8000, () => {
  console.log(`Custom Redis Server running on port ${PORT}`);
  
})