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

  useEffect(() => {
    const saved = localStorage.getItem('mern_session');
    if (saved) {
      setSesion(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Obtener la lista de usuarios reales registrados anteriormente
    const registrados: Usuario[] = JSON.parse(localStorage.getItem('usuarios_registrados') || '[]');

    // 2. Verificar si los datos coinciden con algún registro
    const usuarioValido = registrados.find(
      (u) => u.user.trim().toLowerCase() === userValue.trim().toLowerCase() && 
             u.email.trim().toLowerCase() === emailValue.trim().toLowerCase()
    );

    if (usuarioValido) {
      // Si existe, creamos la sesión con sus datos originales
      localStorage.setItem('mern_session', JSON.stringify(usuarioValido));
      setSesion(usuarioValido);
    } else {
      // Si no existe, lanzamos un aviso
      alert("⚠️ Usuario no encontrado. Por favor, regístrate primero o verifica tus datos.");
    }
  };

  const handleConfirmar = () => {
    if (sesion) onLoginSuccess(sesion);
  };

  const handleEliminar = () => {
    localStorage.removeItem('mern_session');
    setSesion(null);
    setUserValue('');
    setEmailValue('');
  };

  return (
    <div className="login-card">
      {!sesion ? (
        <div className="auth-content">
          <div className="auth-header">
            <h2>Iniciar Sesión</h2>
            <p>Usa tu cuenta registrada para continuar</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-field">
              <label>Usuario</label>
              <input 
                type="text" 
                placeholder="Nombre de usuario" 
                value={userValue}
                onChange={(e) => setUserValue(e.target.value)} 
                required 
              />
            </div>
            <div className="input-field">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="correo@ejemplo.com" 
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn-main">Ingresar</button>
          </form>
        </div>
      ) : (
        <div className="auth-content">
          <div className="auth-header">
            <div className="status-badge">Usuario Verificado</div>
            <h2>¡Hola de nuevo, {sesion.user}!</h2>
          </div>
          <div className="session-details">
            <div className="detail-item">
              <span>Email</span>
              <strong>{sesion.email}</strong>
            </div>
            <div className="detail-item">
              <span>Fecha de registro</span>
              <strong>{sesion.date}</strong>
            </div>
          </div>
          <div className="action-group">
            <button onClick={handleConfirmar} className="btn-main">
              Confirmar y Entrar 🚀
            </button>
            <button onClick={handleEliminar} className="btn-secondary">
              Usar otra cuenta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;