import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <--- IMPORTANTE
import { connectDB } from './config/db';
import apiRouter from './routes/api';
import authRouter from './routes/auth';

dotenv.config();
const app = express();

// Configuración de Middlewares
app.use(cors()); // <--- ESTO SOLUCIONA EL "API STATUS: ERROR"
app.use(express.json());

// Rutas
app.use('/api', apiRouter);
app.use('/api/auth', authRouter);

const PORT = Number(process.env.PORT) || 4000;

connectDB()
  .then(() => {
    // Escuchar en '0.0.0.0' permite que Docker acepte conexiones externas
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });