module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
  
      socket.on('join', isResident => { 
          // If needed, specific room logic here. 
          // For now, client joins rooms explicitly or we handle it here.
      });
      
      socket.on('joinRoom', (room) => {
          socket.join(room);
          console.log(`Socket ${socket.id} joined room ${room}`);
      });
  
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
      
      // Chat in Complaint
      socket.on('joinComplaint', (complaintId) => {
          socket.join(`complaint-${complaintId}`);
      });
    });
};
