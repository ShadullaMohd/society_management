require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./models');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity in development
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Database Connection
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return db.sequelize.sync({ alter: true }); // Sync models
  })
  .then(() => {
    console.log('Models synced...');
  })
  .catch(err => {
    console.log('Error: ' + err);
  });

// Socket.io logic
const socketHandler = require('./sockets/socketHandler');
socketHandler(io);

// Pass io to routes via middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/amenities', require('./routes/amenities'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
