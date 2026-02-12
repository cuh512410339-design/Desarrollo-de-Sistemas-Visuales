import { useState, useMemo, useEffect } from 'react';
import './RegistroForm.css';

import ofertaIcon from '../assets/carrito.svg';

interface Usuario {
  _id?: string;
  user: string;
  email: string;
  password?: string;
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
  const [idParaEditar, setIdParaEditar] = useState<string | null>(null);
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
  const prepararEdicion = (reg: Usuario) => {
  setIdParaEditar(reg._id || null);
  setUsuario(reg.user);
  setCorreo(reg.email);
  setPassword(''); // Por seguridad, password vacío para reescribir
  setAceptaTerminos(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  };
const manejarGuardado = async (e: React.FormEvent) => {
  e.preventDefault();
  setEstaGuardando(true);
  setProgresoGuardado(30);

  // 1. Decidimos qué método y URL usar
  const metodo = idParaEditar ? 'PUT' : 'POST';
  const url = idParaEditar 
    ? `${import.meta.env.VITE_API_URL}/usuarios/${idParaEditar}`
    : `${import.meta.env.VITE_API_URL}/usuarios`;

  const datosUsuario = { 
    user: usuario, 
    email: correo, 
    password: password, 
    date: idParaEditar ? undefined : new Date().toLocaleString() 
  };

  try {
    setProgresoGuardado(60);
    // 2. Petición al servidor incluyendo el TOKEN de seguridad
    const response = await fetch(url, {
      method: metodo,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('mern_token')}` // <-- TOKEN AQUÍ
      },
      body: JSON.stringify(datosUsuario)
    });

    if (!response.ok) throw new Error("Error en la operación");

    setProgresoGuardado(100);
    alert(idParaEditar ? "✅ Perfil actualizado" : "✅ Registro creado");

    // 3. Resetear formulario y recargar lista
    setIdParaEditar(null);
    setUsuario(''); setCorreo(''); setPassword('');
    
    // Función para recargar la lista de la base de datos
    const respCargar = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`);
    const nuevosRegistros = await respCargar.json();
    setRegistros(nuevosRegistros);

  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error de comunicación con MongoDB");
  } finally {
    setTimeout(() => {
      setEstaGuardando(false);
      setProgresoGuardado(0);
      if (!idParaEditar) onRegistroExitoso(datosUsuario as Usuario);
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
        <h2>{idParaEditar ? '🛠️ Editando Perfil' : 'Registro a Evento'}</h2>
        
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
          {idParaEditar && (
  <button 
    type="button" 
    className="btn-back"
    onClick={() => { setIdParaEditar(null); setUsuario(''); setCorreo(''); setPassword(''); }} 
    style={{ marginTop: '10px', background: '#f4f4f4', color: '#666' }}
  >
    Cancelar Edición
  </button>
)}
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
