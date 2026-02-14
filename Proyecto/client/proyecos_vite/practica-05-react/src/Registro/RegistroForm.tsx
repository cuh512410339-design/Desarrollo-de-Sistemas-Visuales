import { useState, useMemo } from 'react';
import './RegistroForm.css';
import ofertaIcon from '../assets/carrito.svg';

interface Usuario {
  _id?: string;
  user: string;
  email: string;
  password?: string;
  role: 'admin' | 'gestor' | 'cliente' | 'invitado';
  date: string;
}

interface RegistroProps {
  onFinalizar: () => void;
  onRegistroExitoso: (datos: Usuario) => void;
}

const CampoForm = ({ label, valor, cambiarValor, tipo = "text", error, mensaje }: any) => (
  <div className="campo-container">
    <label>{label}</label>
    <input
      type={tipo}
      value={valor}
      className={`input-dinamico ${error ? 'error-border' : ''}`}
      onChange={(e) => cambiarValor(e.target.value)}
    />
    {error && <span className="error-mensaje">{mensaje}</span>}
  </div>
);

export default function RegistroForm({ onFinalizar, onRegistroExitoso }: RegistroProps) {
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<'admin' | 'gestor' | 'cliente' | 'invitado'>('cliente');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // --- VALIDACIONES ---
  const validaciones = useMemo(() => {
    const errorUser = usuario.length > 0 && usuario.length < 3 ? "Mínimo 3 letras" : "";
    const errorEmail = correo.length > 0 && !correo.includes('@') ? "Correo inválido" : "";
    const errorPass = password.length > 0 && password.length < 8 ? "Mínimo 8 caracteres" : "";
    return { errorUser, errorEmail, errorPass };
  }, [usuario, correo, password]);

  const progresoLlenado = useMemo(() => {
    let puntos = 0;
    if (usuario.length >= 3) puntos += 34;
    if (correo.includes('@')) puntos += 33;
    if (password.length >= 8) puntos += 33;
    return puntos;
  }, [usuario, correo, password]);

  // --- GUARDAR (SOLO POST) ---
const manejarGuardado = async (e: React.FormEvent) => {
    e.preventDefault();

    const datosUsuario = { 
      user: usuario, 
      email: correo, 
      password, 
      role: rol, 
      date: new Date().toLocaleString() 
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosUsuario)
      });

      if (response.ok) {
  // ✅ PASO CLAVE: Capturamos el usuario real que creó MongoDB (con su _id y email)
  const usuarioCreado = await response.json(); 

  setMensajeExito("🚀 Usuario guardado exitosamente");
  
  // Limpieza de inputs...
  
  setTimeout(() => {
    setMensajeExito(null);
    // ✅ PASAMOS EL OBJETO COMPLETO QUE VIENE DEL SERVIDOR
    onRegistroExitoso(usuarioCreado); 
  }, 2000);
} else {
        setMensajeExito("❌ Error al guardar en la base de datos");
        setTimeout(() => setMensajeExito(null), 3000);
      }
    } catch (error) {
      // Sustituimos el alert por el mensaje en HTML
      setMensajeExito("📡 Error de conexión con el servidor");
      setTimeout(() => setMensajeExito(null), 3000);
    }
  };

  return (
    <div className="registro-wrapper-layout">
      <div className="visual-section">
        <div className="circle-brand">
          <img src={ofertaIcon} alt="Logo" className="brand-image-logo" />
        </div>
      </div>

      <div className="registro-card">
        <h2>Crear Cuenta</h2>
        
        <div className="progreso-wrapper">
          <small>Progreso: {progresoLlenado}%</small>
          <div className="progress-bg">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${progresoLlenado}%`, 
                backgroundColor: progresoLlenado === 100 ? '#00a650' : '#FF9800'
              }}
            ></div>
          </div>
        </div>

        <form onSubmit={manejarGuardado}>
          <CampoForm label="Nombre de usuario" valor={usuario} cambiarValor={setUsuario} error={!!validaciones.errorUser} mensaje={validaciones.errorUser} />
          <CampoForm label="Correo electrónico" valor={correo} cambiarValor={setCorreo} error={!!validaciones.errorEmail} mensaje={validaciones.errorEmail} />
          <CampoForm label="Contraseña" valor={password} cambiarValor={setPassword} tipo="password" error={!!validaciones.errorPass} mensaje={validaciones.errorPass} />
          
          <div className="campo-container">
            <label>Tipo de cuenta</label>
            <select value={rol} onChange={(e) => setRol(e.target.value as any)} className="input-dinamico">
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
              <option value="gestor">Gestor</option>
              <option value="invitado">Invitado</option>
            </select>
          </div>

          <div className="terms-checkbox">
            <input type="checkbox" checked={aceptaTerminos} onChange={(e) => setAceptaTerminos(e.target.checked)} />
            <label>Acepto términos y condiciones</label>
          </div>

          {mensajeExito && (
            <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '8px', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>
              {mensajeExito}
            </div>
          )}

          <button className="btn-save" type="submit" disabled={progresoLlenado < 100 || !aceptaTerminos}>
            Registrarme
          </button>
        </form>

        <button onClick={onFinalizar} className="btn-back" style={{ width: '100%', marginTop: '20px', background: 'none', color: '#666', border: '1px solid #ddd' }}>
          ← Ya tengo cuenta, volver
        </button>
      </div>
    </div>
  );
}