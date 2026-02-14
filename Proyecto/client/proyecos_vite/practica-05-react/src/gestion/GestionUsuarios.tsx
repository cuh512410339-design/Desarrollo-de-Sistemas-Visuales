import { useState, useEffect } from 'react';
import './GestionUsuarios.css';

interface Usuario {
  _id: string;
  user: string;
  email: string;
  role: string;
  date: string;
}

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);

  const traerUsuarios = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('mern_token')}` }
      });
      const datos = await response.json();
      setUsuarios(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  const borrarUsuario = async (id: string) => {
    if (!confirm("¿Eliminar este usuario definitivamente?")) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('mern_token')}` }
      });

      if (response.ok) {
        setUsuarios(usuarios.filter(u => u._id !== id));
        alert("Usuario eliminado con éxito");
      } else {
        alert("No tienes permisos de administrador.");
      }
    } catch (error) {
      alert("Error en el servidor");
    }
  };

  useEffect(() => { traerUsuarios(); }, []);

  return (
    <div className="gestion-container">
      <header className="gestion-header">
        <h1>Panel de Administración</h1>
        <button onClick={traerUsuarios} className="btn-refresh">🔄 Actualizar</button>
      </header>

      {cargando ? <p>Cargando usuarios...</p> : (
        <div className="tabla-wrapper">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u._id}>
                  <td>{u.user}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                  <td>
                    <button onClick={() => borrarUsuario(u._id)} className="btn-delete">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}