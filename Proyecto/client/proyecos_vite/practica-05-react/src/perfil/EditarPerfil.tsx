import { useState, useEffect } from 'react';

export default function EditarPerfil() {
  const [datos, setDatos] = useState({
    user: '',
    email: '',
    bio: '' // Un campo extra para diferenciarlo del registro
  });

  // --- EFECTO BORRADOR: Recuperar al cargar ---
  useEffect(() => {
    const borradorGuardado = localStorage.getItem('borrador_perfil');
    if (borradorGuardado) {
      setDatos(JSON.parse(borradorGuardado));
    }
  }, []);

  // --- EFECTO BORRADOR: Guardar al escribir ---
  useEffect(() => {
    localStorage.setItem('borrador_perfil', JSON.stringify(datos));
  }, [datos]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const guardarEnMongo = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría tu fetch PUT a la API
    console.log("Sincronizando con MongoDB...", datos);
    
    // Al tener éxito, limpiamos el borrador
    localStorage.removeItem('borrador_perfil');
    alert("✅ Perfil actualizado en MongoDB");
  };

  return (
    <div className="gestion-container">
      <h2>Edición de Perfil (Formulario 3)</h2>
      <form onSubmit={guardarEnMongo}>
        <div className="campo-container">
          <label>Nombre Público</label>
          <input 
            name="user" 
            value={datos.user} 
            onChange={manejarCambio} 
            className="input-dinamico" 
          />
        </div>
        <div className="campo-container">
          <label>Biografía</label>
          <textarea 
            name="bio" 
            value={datos.bio} 
            onChange={manejarCambio} 
            className="input-dinamico"
            placeholder="Cuenta algo sobre ti..."
          />
        </div>
        <button type="submit" className="btn-save">Actualizar Datos</button>
      </form>
    </div>
  );
}