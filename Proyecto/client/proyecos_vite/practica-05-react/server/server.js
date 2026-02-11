require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configuración de variables de entorno
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/practica05';

// Middlewares
app.use(cors());
app.use(express.json());

// 1. CONEXIÓN ÚNICA A MONGO
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB (Docker)"))
  .catch(err => console.error("❌ Error de conexión:", err));

// 2. MODELO DE DATOS (Añadimos password explícito)
const Usuario = mongoose.model('Usuario', {
  user: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, 
  date: String
});

// 3. RUTA POST (Registro)
app.post('/api/usuarios', async (req, res) => {
  try {
    const nuevo = new Usuario(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar en MongoDB" });
  }
});

// 4. RUTA GET (Login y Listado)
app.get('/api/usuarios', async (req, res) => {
  try {
    const { user, password } = req.query;
    const filtro = user && password ? { user, password } : {};
    const resultados = await Usuario.find(filtro);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar MongoDB" });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));