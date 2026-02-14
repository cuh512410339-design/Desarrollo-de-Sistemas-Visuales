require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/practica05';
const SECRET_KEY = process.env.SECRET_KEY || "mi_clave_secreta_provisional";

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error de conexión:", err));

// REQUISITO: Esquema con los 4 roles específicos
const Usuario = mongoose.model('Usuario', {
  user: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  date: String,
  role: { 
    type: String, 
    enum: ['admin', 'gestor', 'cliente', 'invitado'], 
    default: 'cliente' 
  }
});

// ==========================================
// MIDDLEWARES DE SEGURIDAD (RBAC)
// ==========================================

// 1. Verificar si el usuario está logueado (Token JWT)
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Acceso denegado (No hay token)" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido o expirado" });
    req.user = decoded; // Guardamos ID y Rol en la petición
    next();
  });
};

// 2. Verificar Roles (RBAC)
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ error: "No tienes permisos para esta acción" });
    }
    next();
  };
};

// ==========================================
// RUTAS DE LA API
// ==========================================

// LOGIN (Cambiado a POST por seguridad)
app.post('/api/login', async (req, res) => {
  try {
    const { user, password } = req.body;
    const usuarioValido = await Usuario.findOne({ user, password });
    
    if (usuarioValido) {
      const token = jwt.sign(
        { id: usuarioValido._id, role: usuarioValido.role },
        SECRET_KEY,
        { expiresIn: '2h' }
      );
      // REQUISITO: El frontend guardará esto en Cookie/LocalStorage
      res.json({ token, user: usuarioValido.user, role: usuarioValido.role });
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
});

// REGISTRO (Público)
app.post('/api/usuarios', async (req, res) => {
  try {
    const nuevo = new Usuario(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar (El email podría estar duplicado)" });
  }
});

// LISTADO (Protegido: Solo Admin y Gestor pueden ver a todos)
app.get('/api/usuarios', verificarToken, verificarRol(['admin', 'gestor']), async (req, res) => {
  const resultados = await Usuario.find();
  res.json(resultados);
});

// ACTUALIZACIÓN (Cualquiera logueado puede editar su perfil, pero solo Admin edita todo)
app.put('/api/usuarios/:id', verificarToken, async (req, res) => {
  try {
    // Regla de negocio: El usuario solo puede editarse a sí mismo, a menos que sea Admin
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: "No puedes editar perfiles ajenos" });
    }

    const actualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

// ELIMINAR (Solo el Admin tiene este permiso)
app.delete('/api/usuarios/:id', verificarToken, verificarRol(['admin']), async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Usuario eliminado correctamente" });
});

app.listen(PORT, () => console.log(`🚀 Servidor RBAC activo en puerto ${PORT}`));