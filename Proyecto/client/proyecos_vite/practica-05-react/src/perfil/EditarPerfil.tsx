import { useState, useEffect } from 'react';
import './EditarPerfil.css';

export default function EditarPerfil() {
  const [datos, setDatos] = useState({
    telefono: '',
    edad: '',
    sexo: ''
  });
  
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // --- LÓGICA PARA IDENTIFICAR AL USUARIO ---
  // Obtenemos la sesión actual para saber de quién son los datos
  const sesionGuardada = localStorage.getItem('mern_session');
  const usuarioActual = sesionGuardada ? JSON.parse(sesionGuardada).user : 'anonimo';
  
  // Creamos una clave única por usuario (ej: perfil_usuario_juan)
  const CLAVE_PERFIL = `perfil_usuario_${usuarioActual}`;

  // 1. CARGA DINÁMICA: Solo lee los datos del usuario logueado
  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE_PERFIL);
    if (guardado) {
      try {
        setDatos(JSON.parse(guardado));
      } catch (e) {
        console.error("Error al parsear datos");
      }
    } else {
      // Si el usuario no tiene datos previos, limpiamos el formulario
      setDatos({ telefono: '', edad: '', sexo: '' });
    }
  }, [CLAVE_PERFIL]); // Se recarga si cambias de usuario

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();

    // 2. VALIDACIONES
    const edadNum = Number(datos.edad);
    if (edadNum < 0 || edadNum > 150) {
      setMensaje({ tipo: 'error', texto: '❌ La edad debe estar entre 0 y 150.' });
      return;
    }

    // 3. GUARDADO DINÁMICO
    // Guardamos bajo la clave específica de este usuario
    localStorage.setItem(CLAVE_PERFIL, JSON.stringify(datos));
    
    setMensaje({ tipo: 'success', texto: `✅ Perfil de ${usuarioActual} guardado` });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 2000);
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h3>👤 Datos de {usuarioActual}</h3>
        <p style={{fontSize: '11px', color: '#888'}}>Los datos se guardan de forma privada para tu cuenta.</p>
        
        <form onSubmit={guardar}>
          <div className="form-group">
            <label>Teléfono</label>
            <input 
              type="number" 
              value={datos.telefono}
              onChange={(e) => setDatos({...datos, telefono: e.target.value})}
              placeholder="Tu número"
            />
          </div>

          <div className="form-group">
            <label>Edad</label>
            <input 
              type="number" 
              value={datos.edad}
              onChange={(e) => setDatos({...datos, edad: e.target.value})}
              placeholder="0 - 150"
            />
          </div>

          <div className="form-group">
            <label>Sexo</label>
            <select 
              value={datos.sexo}
              onChange={(e) => setDatos({...datos, sexo: e.target.value})}
              className="perfil-select"
            >
              <option value="">Seleccionar...</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <button type="submit" className="btn-save-simple">
            Guardar Cambios
          </button>

          {mensaje.texto && (
            <p className={mensaje.tipo === 'error' ? 'error-msg' : 'success-msg'}>
              {mensaje.texto}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}