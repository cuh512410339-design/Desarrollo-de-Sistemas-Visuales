import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import apiRouter from './routes/api';
import authRouter from './routes/auth';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api', apiRouter);
app.use('/api/auth', authRouter);

const PORT = Number(process.env.PORT) || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });
