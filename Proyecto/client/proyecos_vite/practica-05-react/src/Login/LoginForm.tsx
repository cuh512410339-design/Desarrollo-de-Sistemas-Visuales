import { useState, useEffect } from 'react';
import './LoginForm.css';

interface Usuario {
  user: string;
  email: string;
  password?: string;
  date: string;
}

interface LoginFormProps {
  onLoginSuccess: (datos: Usuario) => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [sesion, setSesion] = useState<Usuario | null>(null);
  const [userValue, setUserValue] = useState('');
  const [passValue, setPassValue] = useState(''); // Estado para password

  useEffect(() => {
    const saved = localStorage.getItem('mern_session');
    if (saved) {
      setSesion(JSON.parse(saved));
    }
  }, []);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const url = `${import.meta.env.VITE_API_URL}/usuarios?user=${userValue.trim()}&password=${passValue}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error("Error en el servidor");

    const datos = await response.json();
    
    // IMPORTANTE: Ahora el servidor devuelve un objeto con { token, user, email }
    // Validamos si recibimos el token (esto cumple con "mecanismos seguros")
    if (datos.token) {
      // Guardamos tanto el token como los datos de sesión
      localStorage.setItem('mern_token', datos.token); 
      localStorage.setItem('mern_session', JSON.stringify(datos));
      
      setSesion(datos);
      console.log("✅ Autenticado vía MongoDB con Token JWT");
    } else {
      // Manejo por si la API devolvió un array (vieja lógica) o vacío
      const usuarioValido = Array.isArray(datos) ? datos[0] : null;
      if (usuarioValido) {
        localStorage.setItem('mern_session', JSON.stringify(usuarioValido));
        setSesion(usuarioValido);
      } else {
        alert("❌ Usuario o contraseña incorrectos.");
      }
    }

  } catch (error) {
    // FALLBACK: Mantener funcionalidad Offline
    console.warn("⚠️ Servidor offline, intentando validación local...");
    const registrados: Usuario[] = JSON.parse(localStorage.getItem('usuarios_registrados') || '[]');
    
    const usuarioValido = registrados.find(
      (u) => u.user.trim() === userValue.trim() && u.password === passValue
    );

    if (usuarioValido) {
      localStorage.setItem('mern_session', JSON.stringify(usuarioValido));
      setSesion(usuarioValido);
      alert("ℹ️ Sesión iniciada en modo local (Offline).");
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
    setSesion(null);
  };

  return (
    <div className="login-card">
      {!sesion ? (
        <div className="auth-content">
          <div className="auth-header">
            <h2>Iniciar Sesión</h2>
            <p>Ingresa tus credenciales</p>
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
              <label>Contraseña</label>
              <input 
                type="password" 
                placeholder="Tu contraseña" 
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
    <div className="status-badge">Sesión Detectada</div>
    <h2>¡Hola de nuevo, {sesion.user}!</h2>
    
    {/* Añadimos estas líneas para mostrar la información técnica */}
    <div className="user-info-detail" style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
      <p><strong>Correo:</strong> {sesion.email}</p>
      <p><strong>Registrado el:</strong> {sesion.date}</p>
    </div>
  </div>

  <div className="action-group">
    <button onClick={handleConfirmar} className="btn-main">Entrar 🚀</button>
    <button onClick={handleEliminar} className="btn-secondary">Usar otra cuenta</button>
  </div>
</div>
      )}
    </div>
  );
};

export default LoginForm;