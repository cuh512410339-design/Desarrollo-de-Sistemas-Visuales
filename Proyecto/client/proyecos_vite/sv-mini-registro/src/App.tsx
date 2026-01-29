import { useEffect, useState } from 'react';

// Definición de tipos
type Estado = 'Pendiente' | 'En Ejecucion' | 'Terminado';

interface Tarea {
  id: number;
  texto: string;
  estado: Estado;
}

export default function App() {
  // 1) ESTADO: Cargar de localStorage o iniciar vacío
  const [tareas, setTareas] = useState<Tarea[]>(() => {
    const guardadas = localStorage.getItem('kanban-tasks');
    return guardadas ? JSON.parse(guardadas) : [];
  });
  const [nuevaTarea, setNuevaTarea] = useState('');

  // 2) PERSISTENCIA: Guardar en localStorage cada que cambien las tareas
  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tareas));
  }, [tareas]);

  // 3) MANEJO DE TAREAS
  const agregarTarea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;

    const tarea: Tarea = {
      id: Date.now(),
      texto: nuevaTarea,
      estado: 'Pendiente',
    };

    setTareas([...tareas, tarea]);
    setNuevaTarea('');
    alert('¡Tarea creada con éxito!');
  };

  // --- NUEVA FUNCIÓN: BORRAR TAREA ---
  const borrarTarea = (id: number) => {
    if (confirm('¿Deseas eliminar esta tarea?')) {
      const filtradas = tareas.filter(t => t.id !== id);
      setTareas(filtradas);
    }
  };

  // 4) LÓGICA DE DRAG & DROP
  const onDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('tareaId', id.toString());
  };

  const onDrop = (e: React.DragEvent, nuevoEstado: Estado) => {
    const id = Number(e.dataTransfer.getData('tareaId'));
    const nuevasTareas = tareas.map((t) => 
      t.id === id ? { ...t, estado: nuevoEstado } : t
    );
    setTareas(nuevasTareas);
  };

  const permitirDrop = (e: React.DragEvent) => e.preventDefault();

  // 5) FUNCIÓN PARA COLOR DINÁMICO
  const getColumnaColor = (cantidad: number) => {
    if (cantidad === 0) return '#f0f0f0'; 
    if (cantidad <= 2) return '#d4edda'; 
    if (cantidad <= 4) return '#fff3cd'; 
    return '#f8d7da'; 
  };

  const columnas: Estado[] = ['Pendiente', 'En Ejecucion', 'Terminado'];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Kanban con funciones y eventos React</h1>

      <form onSubmit={agregarTarea} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Escribe una tarea..."
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit">Agregar Tarea</button>
      </form>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        {columnas.map((col) => {
          const tareasFiltradas = tareas.filter((t) => t.estado === col);
          
          return (
            <div
              key={col}
              onDragOver={permitirDrop}
              onDrop={(e) => onDrop(e, col)}
              style={{
                width: '250px',
                minHeight: '400px',
                borderRadius: '8px',
                padding: '10px',
                backgroundColor: getColumnaColor(tareasFiltradas.length),
                border: '1px solid #ccc',
                transition: 'background-color 0.3s'
              }}
            >
              <h3 style={{ color: '#333', textAlign: 'center' }}>
                {col} ({tareasFiltradas.length})
              </h3>
              
              {tareasFiltradas.map((tarea) => (
                <div
                  key={tarea.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, tarea.id)}
                  style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    margin: '10px 0',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    cursor: 'grab',
                    color: '#333',
                    display: 'flex',            // Flex para alinear texto y botón
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{tarea.texto}</span>
                  
                  {/* BOTÓN DE BORRAR */}
                  <button 
                    onClick={() => borrarTarea(tarea.id)}
                    style={{
                      background: '#ff4d4d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}