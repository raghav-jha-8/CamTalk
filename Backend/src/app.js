import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { connectToSocket } from './controllers/socketManager.js';
import userRoutes from './routes/users.routes.js';

dotenv.config(); // Load variables from .env

const app = express();
const server = createServer(app);
const io = connectToSocket(server); // Socket.io setup

// Middleware
app.use(cors());
app.use(express.json({ limit: '40kb' }));
app.use(express.urlencoded({ limit: '40kb', extended: true }));

// Routes
app.use('/api/v1/users', userRoutes);

// Test route
app.get('/home', (req, res) => {
  return res.json({ hello: 'World' });
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 8000;

    // DB connection
    const connectionDB = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${connectionDB.connection.host}`);

    // Start server
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

start();
