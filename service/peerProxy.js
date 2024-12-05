const { WebSocketServer } = require('ws');
const uuid = require('uuid');

function peerProxy(httpServer) {
  // Create a websocket object
  const wss = new WebSocketServer({ noServer: true });

  // Handle the protocol upgrade from HTTP to WebSocket
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });

  // Keep track of all the connections so we can forward messages
  let connections = [];

  ws.on('message', function message(data) {
    try {
      const parsedData = JSON.parse(data);
      // Broadcast parsed data, ensuring all clients receive valid JSON
      connections.forEach((c) => {
        if (c.id !== connection.id) {
          c.ws.send(JSON.stringify(parsedData));
        }
      });
    } catch (err) {
      console.error('Failed to parse WebSocket message:', err);
    }
  });

  
  wss.on('connection', (ws) => {
    console.log('New connection established');
    const connection = { id: uuid.v4(), alive: true, ws: ws };
    connections.push(connection);
  
    ws.on('message', (data) => {
      console.log(`Received message: ${data}`);
      connections.forEach((c) => {
        if (c.id !== connection.id) {
          c.ws.send(data);
        }
      });
    });

    ws.on('close', () => {
        console.log(`Connection closed: ${connection.id}`);
        const pos = connections.findIndex((o) => o.id === connection.id);
        if (pos >= 0) {
          connections.splice(pos, 1);
        }
      });

    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error}`);
      });

    // Respond to pong messages by marking the connection alive
    ws.on('pong', () => {
      connection.alive = true;
    });
  });

  // Keep active connections alive
  setInterval(() => {
    connections.forEach((c) => {
      // Kill any connection that didn't respond to the ping last time
      if (!c.alive) {
        c.ws.terminate();
      } else {
        c.alive = false;
        c.ws.ping();
      }
    });
  }, 10000);
}

module.exports = { peerProxy };
