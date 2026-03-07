const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const httpServer = http.createServer(app);
// Socket.io server banao
const io = new Server(httpServer, {
  cors: { 
    origin: process.env.CLIENT_URL || 'http://localhost:3000'
  }
});

// io ko har route mein available karao
// req.io se access kar sakte hain controllers mein
app.use((req, res, next) => { 
  req.io = io; 
  next(); 
});
app.use(helmet());           // security headers
// app.use(mongoSanitize({ allowDots: true }));
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true 
}));
app.use(express.json());
app.use(morgan('dev'));       // requests log karta hai

// Rate limiting - ek IP se zyada requests nahi
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200                   // max 200 requests
});
app.use('/api', limiter);

// Uploaded files serve karo
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Abhi placeholder hai - baad mein uncomment karna
// app.use('/api/auth',            require('./routes/auth'));
// app.use('/api/rbac',            require('./routes/roles'));
// app.use('/api/vendors',         require('./routes/vendors'));
// app.use('/api/products',        require('./routes/products'));
// app.use('/api/services',        require('./routes/services'));
// app.use('/api/consumers',       require('./routes/consumers'));
// app.use('/api/purchase-orders', require('./routes/purchaseOrders'));
// app.use('/api/analytics',       require('./routes/analytics'));
// app.use('/api/ai',              require('./routes/ai'));

// Health check - server chal raha hai test karo
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});
// Error handler - sabse neeche hota hai hamesha
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ 
    success: false, 
    message: err.message || 'Server Error' 
  });
});

// Socket logic
require('./sockets')(io);

// MongoDB connect karo aur server start karo
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => { 
    console.error('MongoDB error:', err); 
    process.exit(1); 
  });