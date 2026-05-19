import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import captureRoutes from './routes/capture.js';
import sessionsRoutes from './routes/sessions.js';
import authRoutes from './routes/auth.js';
import { initSocket } from './socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
initSocket(server);

const port = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(limiter);
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/capture', captureRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected');

    server.listen(port, () => {
      console.log(`ShadowGrid server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

startServer();
