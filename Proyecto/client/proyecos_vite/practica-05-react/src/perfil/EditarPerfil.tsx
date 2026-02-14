import { useState, useEffect } from 'react';
import './EditarPerfil.css';

export default function EditarPerfil() {
  const [datos, setDatos] = useState({
    telefono: '',
    edad: '',
    sexo: ''
  });
  
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem('perfil_personal_simple') || '{}');
    setDatos({
      telefono: guardado.telefono || '',
      edad: guardado.edad || '',
      sexo: guardado.sexo || ''
    });
  }, []);

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación final de seguridad
    const edadNum = Number(datos.edad);
    if (edadNum < 0 || edadNum > 150) {
      setMensaje({ tipo: 'error', texto: '❌ Edad no válida (debe ser entre 0 y 150).' });
      return;
    }

    localStorage.setItem('perfil_personal_simple', JSON.stringify(datos));
    setMensaje({ tipo: 'success', texto: '✅ ¡Perfil actualizado correctamente!' });
    
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 2000);
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h3>👤 Mi Perfil Personal</h3>
        <p className="perfil-hint">Datos locales (Seguros y privados).</p>
        
        <form onSubmit={guardar}>
          <div className="form-group">
            <label>Teléfono</label>
            <input 
              type="number" 
              min="0"
              placeholder="Ej: 600123456"
              value={datos.telefono}
              onChange={(e) => {
                const val = e.target.value;
                if (Number(val) >= 0 || val === '') setDatos({...datos, telefono: val});
              }}
            />
          </div>

          <div className="form-group">
            <label>Edad </label>
            <input 
              type="number" 
              min="0" 
              max="150" // Límite en la interfaz
              placeholder="Tu edad"
              value={datos.edad}
              onChange={(e) => {
                const val = e.target.value;
                const num = Number(val);
                // Bloqueamos valores negativos o mayores a 150 en tiempo real
                if ((num >= 0 && num <= 150) || val === '') {
                  setDatos({...datos, edad: val});
                }
              }}
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
            <p className={`msg-${mensaje.tipo}`}>{mensaje.texto}</p>
          )}
        </form>
      </div>
    </div>
  );
}