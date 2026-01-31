import { useState, useMemo, useEffect } from 'react';
import './RegistroForm.css';

import ofertaIcon from '../assets/carrito.svg';

interface Usuario {
  user: string;
  email: string;
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
    const guardados = JSON.parse(localStorage.getItem('usuarios_registrados') || '[]');
    setRegistros(guardados);
  }, []);

  // Solo suma progreso si NO hay errores y hay contenido
  const progresoLlenado = useMemo(() => {
    let puntos = 0;
    if (usuario.length >= 3 && !validaciones.errorUser) puntos += 34;
    if (correo.length > 5 && !validaciones.errorEmail) puntos += 33;
    if (password.length >= 6 && !validaciones.errorPass) puntos += 33;
    return puntos;
  }, [usuario, correo, password, validaciones]);

  const manejarGuardado = (e: React.FormEvent) => {
    e.preventDefault();
    setEstaGuardando(true);
    let avance = 0;
    const intervalo = setInterval(() => {
      avance += 20;
      setProgresoGuardado(avance);
      if (avance >= 100) {
        clearInterval(intervalo);
        const nuevoUsuario = { user: usuario, email: correo, date: new Date().toLocaleString() };
        const listaActualizada = [...registros, nuevoUsuario];
        localStorage.setItem('usuarios_registrados', JSON.stringify(listaActualizada));
        localStorage.setItem('mern_session', JSON.stringify(nuevoUsuario));
        onRegistroExitoso(nuevoUsuario);
      }
    }, 200);
  };

  const eliminarRegistros = () => {
    localStorage.removeItem('usuarios_registrados');
    setRegistros([]);
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
          <h3>Registros en LocalStorage</h3>
          <div className="tabla-mini-container">
            {registros.length === 0 ? (
              <p className="no-registros">No hay usuarios registrados</p>
            ) : (
              <ul className="lista-mini">
                {registros.map((reg, i) => (
                  <li key={i}><strong>{reg.user}</strong> - <small>{reg.email}</small></li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={eliminarRegistros} className="btn-delete-all">Eliminar registros</button>
          <button type="button" onClick={onFinalizar} className="btn-back">Volver al Login</button>
        </div>
      </div>
    </div>
  );
}