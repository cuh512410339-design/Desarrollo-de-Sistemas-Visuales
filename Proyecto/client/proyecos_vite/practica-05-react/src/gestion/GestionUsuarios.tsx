import { useState, useEffect } from 'react';
import './GestionUsuarios.css';
import Cookies from 'js-cookie'; // ✅ Importación esencial para leer el token

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

  // Función para obtener el token de forma segura
  const obtenerToken = () => Cookies.get('mern_token');

  const traerUsuarios = async () => {
    setCargando(true);
    try {
      const token = obtenerToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const datos = await response.json();

      // Si el servidor responde con un error de sesión
      if (response.status === 401 || response.status === 403) {
        console.error("No autorizado. Token inválido o expirado.");
        setUsuarios([]);
      } else {
        setUsuarios(Array.isArray(datos) ? datos : []);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setCargando(false);
    }
  };

  const borrarUsuario = async (id: string) => {
    if (!confirm("¿Eliminar este usuario definitivamente?")) return;
    
    try {
      const token = obtenerToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setUsuarios(usuarios.filter(u => u._id !== id));
        alert("Usuario eliminado con éxito");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "No tienes permisos de administrador.");
      }
    } catch (error) {
      alert("Error en el servidor al intentar borrar");
    }
  };

  useEffect(() => { 
    traerUsuarios(); 
  }, []);

  return (
    <div className="gestion-container">
      <header className="gestion-header">
        <div className="header-text">
          <h1>Panel de Administración</h1>
          <p className="subtitle">Gestión de roles y acceso (RBAC)</p>
        </div>
        <button onClick={traerUsuarios} className="btn-refresh">
          🔄 Actualizar Lista
        </button>
      </header>

      {cargando ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando base de datos de usuarios...</p>
        </div>
      ) : (
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
              {usuarios.length > 0 ? (
                usuarios.map(u => (
                  <tr key={u._id}>
                    <td><strong>{u.user}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      {/* Badge con clase dinámica según el rol */}
                      <span className={`badge ${u.role.toLowerCase()}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => borrarUsuario(u._id)} 
                        className="btn-delete"
                        title="Eliminar usuario"
                      >
                        🗑️ Borrar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{textAlign: 'center', padding: '40px'}}>
                    No se encontraron usuarios o la sesión ha expirado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}