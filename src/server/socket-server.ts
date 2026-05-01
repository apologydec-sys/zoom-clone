import { Server } from 'socket.io';
import { createServer } from 'http';
import next from 'next';
import { parse } from 'url';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

type RoomUser = {
  userName: string;
  socketId: string;
};

const rooms = new Map<string, Map<string, RoomUser>>();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', ({ roomId, userName }: { roomId: string; userName: string }) => {
      socket.join(roomId);
      
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map<string, RoomUser>());
      }
      
      const room = rooms.get(roomId)!;
      room.set(socket.id, { userName, socketId: socket.id });

      const usersInRoom = Array.from(room.values()).filter(
        (user) => user.socketId !== socket.id
      );

      socket.emit('users-in-room', usersInRoom);
      socket.to(roomId).emit('user-connected', {
        socketId: socket.id,
        userName,
      });

      console.log(`${userName} joined room: ${roomId}`);
    });

    socket.on('offer', ({ offer, to, from }: { offer: RTCSessionDescriptionInit; to: string; from: string }) => {
      socket.to(to).emit('offer', { offer, from });
    });

    socket.on('answer', ({ answer, to, from }: { answer: RTCSessionDescriptionInit; to: string; from: string }) => {
      socket.to(to).emit('answer', { answer, from });
    });

    socket.on('ice-candidate', ({ candidate, to, from }: { candidate: RTCIceCandidateInit; to: string; from: string }) => {
      socket.to(to).emit('ice-candidate', { candidate, from });
    });

    socket.on('send-message', ({ roomId, message, userName }: { roomId: string; message: string; userName: string }) => {
      socket.to(roomId).emit('receive-message', {
        message,
        userName,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('toggle-video', ({ roomId, socketId, enabled }: { roomId: string; socketId: string; enabled: boolean }) => {
      socket.to(roomId).emit('user-toggle-video', { socketId, enabled });
    });

    socket.on('toggle-audio', ({ roomId, socketId, enabled }: { roomId: string; socketId: string; enabled: boolean }) => {
      socket.to(roomId).emit('user-toggle-audio', { socketId, enabled });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      rooms.forEach((room, roomId) => {
        if (room.has(socket.id)) {
          room.delete(socket.id);
          socket.to(roomId).emit('user-disconnected', socket.id);
          
          if (room.size === 0) {
            rooms.delete(roomId);
          }
        }
      });
    });
  });

  const PORT = process.env.SOCKET_PORT || 3001;
  server.listen(PORT, () => {
    console.log(`> Server ready on http://localhost:${PORT}`);
  });
});
