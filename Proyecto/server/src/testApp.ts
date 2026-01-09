import express from 'express';
import apiRouter from './routes/api';
import authRouter from './routes/auth';

const app = express();
app.use(express.json());
app.use('/api', apiRouter);
app.use('/api/auth', authRouter);

export default app;
