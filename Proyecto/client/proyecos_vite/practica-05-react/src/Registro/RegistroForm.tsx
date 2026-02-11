import { useState, useMemo, useEffect } from 'react';
import './RegistroForm.css';

import ofertaIcon from '../assets/carrito.svg';

interface Usuario {
  user: string;
  email: string;
  password?: string; // Agregamos esto como opcional
  date: string;
}

interface RegistroProps {
  onFinalizar: () => void;
  onRegistroExitoso: (datos: Usuario) => void;
}

// Componente de Campo actualizado para mostrar mensajes
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
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [estaGuardando, setEstaGuardando] = useState(false);
  const [progresoGuardado, setProgresoGuardado] = useState(0);
  const [registros, setRegistros] = useState<Usuario[]>([]);

  // Lógica de errores específicos
  const validaciones = useMemo(() => {
    const errorUser = usuario.length > 0 && usuario.length < 3 
      ? "Mínimo 3 caracteres" 
      : /[^a-zA-Z0-9 ]/.test(usuario) ? "No uses caracteres especiales" : "";
    
    const errorEmail = correo.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
      ? "Formato inválido (ejemplo@dominio.com)" : "";
    
    const errorPass = password.length > 0 && password.length < 6 
      ? "Contraseña muy corta (mín. 6)" : "";

    return { errorUser, errorEmail, errorPass };
  }, [usuario, correo, password]);

  useEffect(() => {
  const cargarUsuarios = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`);
      if (!response.ok) throw new Error("Error en servidor");
      const datos = await response.json();
      setRegistros(datos);
    } catch (error) {
      console.log("Servidor offline, cargando de LocalStorage (Fallback)");
      const guardados = JSON.parse(localStorage.getItem('usuarios_registrados') || '[]');
      setRegistros(guardados);
    }
  };
  cargarUsuarios();
}, []);

  // Solo suma progreso si NO hay errores y hay contenido
  const progresoLlenado = useMemo(() => {
    let puntos = 0;
    if (usuario.length >= 3 && !validaciones.errorUser) puntos += 34;
    if (correo.length > 5 && !validaciones.errorEmail) puntos += 33;
    if (password.length >= 6 && !validaciones.errorPass) puntos += 33;
    return puntos;
  }, [usuario, correo, password, validaciones]);

  const manejarGuardado = async (e: React.FormEvent) => {
  e.preventDefault();
  setEstaGuardando(true);
  setProgresoGuardado(20);

  const nuevoUsuario = { 
    user: usuario, 
    email: correo, 
    password: password, // Ahora sí se enviará a MongoDB
    date: new Date().toLocaleString() 
  };

  try {
    setProgresoGuardado(60);
    // Usamos la variable de entorno
    const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoUsuario)
    });

    if (!response.ok) throw new Error("Error en el servidor");

    const usuarioGuardado = await response.json();
    
    setProgresoGuardado(100);
    setRegistros(prev => [...prev, usuarioGuardado]);
    alert("✅ Registrado con éxito en MongoDB");

  } catch (error) {
    // FALLBACK
    console.error("Modo Fallback activado:", error);
    const listaActualizada = [...registros, nuevoUsuario];
    localStorage.setItem('usuarios_registrados', JSON.stringify(listaActualizada));
    setRegistros(listaActualizada);
    alert("⚠️ Servidor offline. Guardado en LocalStorage.");
  } finally {
    setTimeout(() => {
      setEstaGuardando(false);
      setProgresoGuardado(0);
      onRegistroExitoso(nuevoUsuario);
    }, 500);
  }
};

  const eliminarRegistros = () => {
    localStorage.removeItem('usuarios_registrados');
    setRegistros([]);
  };

  const eliminarUnRegistro = (indexAEliminar: number) => {
    const confirmacion = window.confirm("¿Eliminar este usuario específico?");
    if (confirmacion) {
      const nuevaLista = registros.filter((_, index) => index !== indexAEliminar);
      setRegistros(nuevaLista);
      localStorage.setItem('usuarios_registrados', JSON.stringify(nuevaLista));
    }
  };

  return (
    <div className="registro-wrapper-layout">
      <div className="visual-section">
        <div className="circle-brand">
          <img 
            src={ofertaIcon} 
            alt="Logo Ofertas" 
            className="brand-image-logo" 
          />
        </div>
      </div>

      <div className="registro-card">
        <h2>Registro a Evento</h2>
        
        <div className="progreso-wrapper">
          <small>Progreso Formulario: {progresoLlenado}%</small>
          <div className="progress-bg">
            <div className="progress-fill" style={{ width: `${progresoLlenado}%`, backgroundColor: progresoLlenado === 100 ? '#4CAF50' : '#FF9800' }}></div>
          </div>
        </div>

        <form onSubmit={manejarGuardado}>
          <CampoForm 
            label="Nombre" 
            valor={usuario} 
            cambiarValor={setUsuario} 
            error={!!validaciones.errorUser} 
            mensaje={validaciones.errorUser} 
          />
          <CampoForm 
            label="Correo" 
            valor={correo} 
            cambiarValor={setCorreo} 
            tipo="email" 
            error={!!validaciones.errorEmail} 
            mensaje={validaciones.errorEmail} 
          />
          <CampoForm 
            label="Password" 
            valor={password} 
            cambiarValor={setPassword} 
            tipo="password" 
            error={!!validaciones.errorPass} 
            mensaje={validaciones.errorPass} 
          />

          <div className="terms-checkbox">
            <input type="checkbox" id="terms" checked={aceptaTerminos} onChange={(e) => setAceptaTerminos(e.target.checked)} />
            <label htmlFor="terms">Acepto términos y condiciones</label>
          </div>

          {estaGuardando && (
            <div className="storage-loader">
              <small>Guardando en LocalStorage...</small>
              <div className="progress-bg">
                <div className="progress-fill storage" style={{ width: `${progresoGuardado}%` }}></div>
              </div>
            </div>
          )}

          <button className="btn-save" type="submit" disabled={progresoLlenado < 100 || !aceptaTerminos || estaGuardando}>
            {estaGuardando ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="registros-section">
          <div className="tabla-mini-container">
            <h3>Registros actuales</h3>
            {registros.length === 0 ? (
              <p className="no-registros">No hay usuarios registrados</p>
            ) : (
              <div className="registros-section">
  
  <div className="tabla-mini-container">
    {registros.length === 0 ? (
      <p className="no-registros">No hay usuarios registrados</p>
    ) : (
      <ul className="lista-mini">
        {registros.map((reg, i) => (
          <li key={i} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px',
            borderBottom: '1px solid #eee' 
          }}>
            <span><strong>{reg.user}</strong> - <small>{reg.email}</small></span>
            
            {/* BOTÓN INDIVIDUAL: Aquí conectamos tu función */}
            <button 
              onClick={() => eliminarUnRegistro(i)} 
              style={{ 
                background: '#ffeded', 
                border: '1px solid #ffcaca', 
                color: '#d32f2f', 
                cursor: 'pointer', 
                borderRadius: '4px',
                padding: '2px 8px',
                fontWeight: 'bold'
              }}
              title="Eliminar este usuario"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
  
  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
    <button onClick={eliminarRegistros} className="btn-delete-all" style={{ flex: 1 }}>
      Eliminar todos
    </button>
    <button type="button" onClick={onFinalizar} className="btn-back" style={{ flex: 1 }}>
      Volver al Login
    </button>
  </div>
</div>
            )}
          </div>
          <button onClick={eliminarRegistros} className="btn-delete-all">Eliminar registros</button>
          <button type="button" onClick={onFinalizar} className="btn-back">Volver al Login</button>
        </div>
      </div>
    </div>
  );
}
