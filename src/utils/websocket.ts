import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { handshake } from '../middlewares/handshake.middleware';
import { Payload } from '../types/payload.type';

export let io: SocketServer;

export const initializeSocket = (server: HTTPServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  io.use(handshake);

  io.on('connection', (socket) => {
    const user = socket.data.user as Payload;

    socket.on('notice', ({ message }: { message: string }) => {
      console.log(message);
    });

    socket.on('disconnect', () => {
      console.log(`user(${user.id}) disconnected.`);
    });
  });

  return io;
};
