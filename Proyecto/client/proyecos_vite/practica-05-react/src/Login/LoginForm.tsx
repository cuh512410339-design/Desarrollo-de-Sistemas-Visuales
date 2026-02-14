import { useState, useEffect } from 'react';
import './LoginForm.css';

// Interfaz actualizada con Roles
interface Usuario {
  user: string;
  email: string;
  role: 'admin' | 'gestor' | 'cliente' | 'invitado'; // Requisito RBAC
  date?: string;
  token?: string;
}

interface LoginFormProps {
  onLoginSuccess: (datos: Usuario) => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [sesion, setSesion] = useState<Usuario | null>(null);
  const [userValue, setUserValue] = useState('');
  const [passValue, setPassValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mern_session');
    if (saved) {
      setSesion(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // REQUISITO: Cambio a POST para envío seguro de credenciales
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user: userValue.trim(), 
          password: passValue 
        })
      });

      const datos = await response.json();

      if (response.ok && datos.token) {
        // REQUISITO: Almacenamiento de Token JWT
        localStorage.setItem('mern_token', datos.token);
        localStorage.setItem('mern_session', JSON.stringify(datos));
        
        setSesion(datos);
        console.log(`✅ Sesión iniciada como: ${datos.role}`);
      } else {
        alert(`❌ ${datos.error || "Error de autenticación"}`);
      }

    } catch (error) {
      console.warn("⚠️ Servidor offline, intentando validación local...");
      // Lógica de Fallback (Opcional según tu requerimiento de persistencia offline)
      const registrados = JSON.parse(localStorage.getItem('usuarios_registrados') || '[]');
      const usuarioValido = registrados.find(
        (u: any) => u.user.trim() === userValue.trim() && u.password === passValue
      );

      if (usuarioValido) {
        setSesion(usuarioValido);
        localStorage.setItem('mern_session', JSON.stringify(usuarioValido));
        alert("ℹ️ Entrando en modo Offline (Sin Token)");
      } else {
        alert("❌ Credenciales no encontradas.");
      }
    }
  };

  const handleConfirmar = () => {
    if (sesion) onLoginSuccess(sesion);
  };

  const handleEliminar = () => {
    localStorage.removeItem('mern_session');
    localStorage.removeItem('mern_token');
    setSesion(null);
  };

  return (
    <div className="login-card">
      {!sesion ? (
        <div className="auth-content">
          <div className="auth-header">
            <h2>Bienvenido</h2>
            <p>Accede a tu cuenta</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-field">
              <label>Usuario</label>
              <input 
                type="text" 
                placeholder="Ej: Usuario123" 
                value={userValue}
                onChange={(e) => setUserValue(e.target.value)} 
                required 
              />
            </div>
            <div className="input-field">
              <label>Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={passValue}
                onChange={(e) => setPassValue(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn-main">Ingresar</button>
          </form>
        </div>
      ) : (
        <div className="auth-content">
          <div className="auth-header">
            <div className="status-badge" style={{ 
              background: sesion.role === 'admin' ? '#ffebee' : '#e8f5e9',
              color: sesion.role === 'admin' ? '#c62828' : '#2e7d32'
            }}>
              Rol: {sesion.role.toUpperCase()}
            </div>
            <h2>¡Hola, {sesion.user}!</h2>
            <p style={{ fontSize: '14px', color: '#666' }}>{sesion.email}</p>
          </div>

          <div className="action-group">
            <button onClick={handleConfirmar} className="btn-main">Entrar al Panel 🚀</button>
            <button onClick={handleEliminar} className="btn-secondary">Cerrar Sesión</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;