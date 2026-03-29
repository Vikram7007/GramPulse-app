module.exports = (io) => {
  console.log('🔥 socket.js LOADED');

  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('joinRoom', (roomName) => {
      console.log('🔥 joinRoom RECEIVED:', roomName);
      if (roomName) {
         socket.join(roomName.trim().toLowerCase());
         console.log('✅ Joined room:', roomName.trim().toLowerCase());
      }
    });

    socket.on('joinGramSevak', (name) => {
      console.log('🔥 joinGramSevak RECEIVED:', name);
      const room = `gramsevak:${name.trim().toLowerCase()}`;
      socket.join(room);
      console.log('✅ Joined room:', room);
    });

    socket.on('joinVillageAdmin', () => {
      console.log('🔥 joinVillageAdmin RECEIVED');
      socket.join('villageAdmin');
      console.log('✅ Joined room: villageAdmin');
    });
  });
};
