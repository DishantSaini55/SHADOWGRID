import { Server } from 'socket.io';

let ioInstance = null;

export function initSocket(server) {
  const clientUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  ioInstance = new Server(server, {
    cors: {
      origin: clientUrl,
      methods: ['GET', 'POST', 'DELETE']
    }
  });

  ioInstance.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} | clients: ${ioInstance.engine.clientsCount}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id} | clients: ${ioInstance.engine.clientsCount}`);
    });
  });

  return ioInstance;
}

export function getIO() {
  return ioInstance;
}
