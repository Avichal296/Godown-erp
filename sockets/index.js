module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    // Dashboard room join karo
    socket.on('join:dashboard', () => {
      socket.join('dashboard');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected:', socket.id);
    });
  });
};