import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/auth.js';
import agentRouter from './routes/agent.js';
import adminRouter from './routes/admin.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/agent', agentRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/', (req, res) => {
  res.send('Payment System Backend');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});