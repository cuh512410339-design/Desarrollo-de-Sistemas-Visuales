require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Importamos JWT

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/practica05';
const SECRET_KEY = "mi_clave_secreta_provisional"; // En producción va al .env

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB (Docker)"))
  .catch(err => console.error("❌ Error de conexión:", err));

const Usuario = mongoose.model('Usuario', {
  user: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, 
  date: String,
  role: { type: String, default: 'user' } // Para el "control de permisos"
});

// --- RUTAS ---

// 3. POST: Registro
app.post('/api/usuarios', async (req, res) => {
  try {
    const nuevo = new Usuario(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar" });
  }
});

// 4. GET: Login con generación de TOKEN
app.get('/api/usuarios', async (req, res) => {
  try {
    const { user, password } = req.query;
    
    if (user && password) {
      const usuarioValido = await Usuario.findOne({ user, password });
      
      if (usuarioValido) {
        // CREACIÓN DEL TOKEN (Mecanismo seguro de sesión)
        const token = jwt.sign(
          { id: usuarioValido._id, role: usuarioValido.role },
          SECRET_KEY,
          { expiresIn: '2h' } // La sesión dura 2 horas
        );
        return res.json({ token, user: usuarioValido.user, email: usuarioValido.email });
      } else {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
    }
    
    // Si no hay query, devolvemos todos (Listado)
    const resultados = await Usuario.find();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// 5. PUT: Actualización (Gestión Integral de Perfiles)
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const actualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo con JWT en http://localhost:${PORT}`));