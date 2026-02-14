import { useState, useEffect } from 'react';
import './LoginForm.css';
import Cookies from 'js-cookie'; // ✅ Importamos la librería

interface Usuario {
  user: string;
  email: string;
  role: 'admin' | 'gestor' | 'cliente' | 'invitado';
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

  // --- REQUISITO: Verificar sesión vía Cookie al cargar ---
  useEffect(() => {
    const token = Cookies.get('mern_token');
    const savedSession = localStorage.getItem('mern_session'); // La info del usuario puede seguir en storage, pero el token MANDATORIO en Cookie
    
    if (token && savedSession) {
      setSesion(JSON.parse(savedSession));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
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
        // --- ✅ CAMBIO CLAVE: GUARDAR EN COOKIE ---
        Cookies.set('mern_token', datos.token, { 
          expires: 1, // 1 día
          secure: true, 
          sameSite: 'strict' 
        });

        if (response.ok && datos.token) {
  // Reemplaza tu línea 56 actual por esta:
const sesionAGuardar = datos.usuario ? { ...datos.usuario, token: datos.token } : datos;
localStorage.setItem('mern_session', JSON.stringify(sesionAGuardar));

  // ✅ Forzamos que el objeto tenga el email y el ID correcto de MongoDB
  const sesionCompleta = {
    ...datos,
    // Usamos el email que viene del servidor o el que el usuario usó (si fuera el caso)
    email: datos.email || 'correo@ejemplo.com', 
    _id: datos._id || datos.id // MongoDB usa _id
  };

  localStorage.setItem('mern_session', JSON.stringify(sesionCompleta));
  setSesion(sesionCompleta);
  onLoginSuccess(sesionCompleta); // Pasamos los datos completos al App.tsx
}
        
        setSesion(datos);
        console.log(`✅ Sesión iniciada como: ${datos.role}`);
      } else {
        alert(`❌ ${datos.error || "Error de autenticación"}`);
      }

    } catch (error) {
      console.warn("⚠️ Servidor offline, intentando validación local...");
      const registrados = JSON.parse(localStorage.getItem('usuarios_registrados') || '[]');
      const usuarioValido = registrados.find(
        (u: any) => u.user.trim() === userValue.trim() && u.password === passValue
      );

      if (usuarioValido) {
        setSesion(usuarioValido);
        localStorage.setItem('mern_session', JSON.stringify(usuarioValido));
        // Nota: En offline no podemos generar un JWT real, pero permitimos el acceso visual
        alert("ℹ️ Entrando en modo Offline (Sin Cookie de Token)");
      } else {
        alert("❌ Credenciales no encontradas.");
      }
    }
  };

  const handleConfirmar = () => {
    if (sesion) onLoginSuccess(sesion);
  };

  const handleEliminar = () => {
    // --- ✅ CAMBIO CLAVE: LIMPIAR COOKIE ---
    Cookies.remove('mern_token');
    localStorage.removeItem('mern_session');
    setSesion(null);
  };

  return (
    <div className="login-card">
      {/* ... El resto de tu JSX se mantiene igual ... */}
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