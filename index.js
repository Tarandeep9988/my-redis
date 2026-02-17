const net = require("net");
const Parser = require("redis-parser");

const store = {};

const server = net.createServer((connection) => {
  console.log("Client connected");

  connection.on('data', data => {
    const parser = new Parser({
      returnReply: (reply) => {
        console.log("r=>", reply);
        const command = reply[0];
        switch (command) {
          case 'set': {
            const key = reply[1];
            const value = reply[2];
            store[key] = value;
            connection.write('+OK\r\n');
            break;
          }
        
          case 'get': {
            const key = reply[1];
            const value = store[key];
            if (value) {
              connection.write(`$${value.length}\r\n${value}\r\n`);
            }
            else {
              connection.write('$-1\r\n'); // return null
            }
            break;
          }

          default: {
            connection.write('+Invalid command\r\n');
            break;
          }
        }
      },
      returnError: (err) => {
        console.log('e=>', err);
        connection.write('+Error\r\n');
      }
    })
    parser.execute(data);
  })
})


const PORT = 8000;

server.listen(8000, () => {
  console.log(`Custom Redis Server running on port ${PORT}`);
  
})