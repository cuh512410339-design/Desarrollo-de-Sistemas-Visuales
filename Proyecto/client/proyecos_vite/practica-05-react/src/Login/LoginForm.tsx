import { useState, useEffect } from 'react';
import './LoginForm.css';

interface Usuario {
  user: string;
  email: string;
  date: string;
}

interface LoginFormProps {
  onLoginSuccess: (datos: Usuario) => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [sesion, setSesion] = useState<Usuario | null>(null);
  const [userValue, setUserValue] = useState('');
  const [emailValue, setEmailValue] = useState('');

  // 1. Al inicio, solo detectamos y mostramos, NO mandamos a la principal
  useEffect(() => {
    const saved = localStorage.getItem('mern_session');
    if (saved) {
      setSesion(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaSesion: Usuario = {
      user: userValue.trim(),
      email: emailValue.trim(),
      date: new Date().toLocaleString()
    };

    localStorage.setItem('mern_session', JSON.stringify(nuevaSesion));
    // 2. Cambiamos el layout a la tarjeta de datos
    setSesion(nuevaSesion);
  };

  // 3. Función para el nuevo botón "Confirmar"
  const handleConfirmar = () => {
    if (sesion) {
      onLoginSuccess(sesion); // Aquí es donde App.tsx recibe el permiso para entrar
    }
  };

  const handleEliminar = () => {
    if (window.confirm("¿Eliminar sesión activa?")) {
      localStorage.removeItem('mern_session');
      setSesion(null);
    }
  };

  return (
    <div className="login-container">
      {!sesion ? (
        <form className="login-form" onSubmit={handleSubmit}>
          <h3>Iniciar Sesión</h3>
          <input 
            type="text" 
            placeholder="Nombre de usuario" 
            onChange={(e) => setUserValue(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            onChange={(e) => setEmailValue(e.target.value)} 
            required 
          />
          <button type="submit">Guardar Datos ✅</button>
        </form>
      ) : (
        /* LAYOUT 2: Datos de sesión con botón de Confirmar */
        <div className="session-card">
          <h3>Sesión Detectada 🛡️</h3>
          <div className="info-box">
            <p><strong>Usuario:</strong> {sesion.user}</p>
            <p><strong>Email:</strong> {sesion.email}</p>
            <p className="date-badge">Almacenado el: {sesion.date}</p>
          </div>
          
          <div className="action-buttons">
            <button onClick={handleConfirmar} className="btn-confirmar">
              Confirmar y Entrar 🚀
            </button>
            <button onClick={handleEliminar} className="btn-danger">
              Eliminar Datos 🗑️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;