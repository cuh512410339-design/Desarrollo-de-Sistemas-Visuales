import { useState, useEffect } from 'react'
import './App.css'
import LoginForm from './Login/LoginForm'
import RegistroForm from './Registro/RegistroForm' // Asegúrate de haber creado este archivo
import GestionUsuarios from './gestion/GestionUsuarios' // Ajusta la ruta si es necesario

import { motion, AnimatePresence } from 'framer-motion'; // Para animaciones
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'; // Para Drag & Drop

// Iconos
import ofertaIcon from './assets/ofertas mern.svg'
import afiliadosIcon from './assets/afiliados mern.svg'
import playIcon from './assets/play mern.svg'
import cuponesIcon from './assets/cupones mern.svg'
import otrosIcon from './assets/otros mern.svg'

function App() {
  const [carrito, setCarrito] = useState<string[]>([]);
  const [sesionActiva, setSesionActiva] = useState<any>(null);
  const [verPanelAdmin, setVerPanelAdmin] = useState(false);
  
  // Nuevo estado para decidir si mostramos el Login o el Registro Dinámico
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  // --- TEMPORIZADOR (Lógica) ---
  const [tiempo, setTiempo] = useState(600); // 10 minutos

  useEffect(() => {
    const timer = setInterval(() => {
      setTiempo((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  

  const formatTiempo = (segundos: number) => {
    
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  
  // Al cargar, verificamos si ya había una sesión guardada
  useEffect(() => {
    const saved = localStorage.getItem('mern_session');
    if (saved) {
      setSesionActiva(JSON.parse(saved));
    }
  }, []);

  const productos = [
    { id: 1, nombre: 'Producto 1' },
    { id: 2, nombre: 'Producto 2' },
    { id: 3, nombre: 'Producto 3' },
    { id: 4, nombre: 'Producto 4' },
    { id: 5, nombre: 'Producto 5' },
    { id: 6, nombre: 'Producto 6' },
  ];

  const agregarAlCarrito = (nombre: string) => {
    setCarrito([...carrito, nombre]);
  };

  const eliminarDelCarrito = (indexAEliminar: number) => {
    setCarrito(carrito.filter((_, index) => index !== indexAEliminar));
  };

// --- PERSISTENCIA ---
  useEffect(() => {
    const guardado = localStorage.getItem('mern_carrito');
    if (guardado) setCarrito(JSON.parse(guardado));
  }, []);

  useEffect(() => {
    localStorage.setItem('mern_carrito', JSON.stringify(carrito));
  }, [carrito]);

  // --- LÓGICA DRAG AND DROP (Añadir aquí) ---
  const alTerminarArrastre = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    // Si el producto cae en la zona del banner (carrito)
    if (destination.droppableId === 'zona-carrito') {
      const productoEncontrado = productos.find(p => p.id.toString() === draggableId);
      if (productoEncontrado) agregarAlCarrito(productoEncontrado.nombre);
    }
  };
  // --- PASO 1: LÓGICA DE ACCESO (LOGIN / REGISTRO) ---
  if (!sesionActiva) {
  return (
    <div className="login-wrapper fade-in">
      {mostrarRegistro ? (
        <RegistroForm 
          onFinalizar={() => setMostrarRegistro(false)} 
          onRegistroExitoso={() => {
            alert("¡Registro exitoso! Por favor inicia sesión.");
            setMostrarRegistro(false); 
          }}
        />
      ) : (
        <div className="auth-container-wrapper">
          <LoginForm onLoginSuccess={(datos: any) => setSesionActiva(datos)} />
          <div className="register-link-container">
            <p>¿No tienes una cuenta aún?</p>
            <button className="btn-text-link" onClick={() => setMostrarRegistro(true)}>
              Crea una cuenta aquí
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

  // --- PASO 2: INTERFAZ PRINCIPAL DE LA TIENDA ---
  if (verPanelAdmin) {
    return (
      <div className="admin-view-wrapper">
        <button 
          onClick={() => setVerPanelAdmin(false)} 
          className="btn-back-to-store"
          style={{margin: '20px', padding: '10px', cursor: 'pointer'}}
        >
          ⬅ Volver a la Tienda
        </button>
        <GestionUsuarios />
      </div>
    );
  }
  return (
    <DragDropContext onDragEnd={alTerminarArrastre}>
      <div className="container">
        <header className="header">
          <div className="search-bar">
            <span className="icon">🔍</span>
            <input type="text" placeholder={`Buscar`} disabled />
          </div>

          {/* CONTENEDOR DE USUARIO Y PANEL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            {/* 1. EL BOTÓN DE ACCESO: Solo se muestra si el usuario es admin */}
            {sesionActiva?.role === 'admin' && (
              <button 
                onClick={() => setVerPanelAdmin(true)}
                style={{
                  background: '#ff9800',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              >
                ⚙️ ADMIN
              </button>
            )}

            {/* 2. TU NOMBRE DE USUARIO Y SALIR (Original) */}
            <div 
              className="location" 
              onClick={() => { localStorage.removeItem('mern_session'); setSesionActiva(null); }}
              style={{ cursor: 'pointer', color: 'white' }}
            >
              {sesionActiva.user} || Salir 
            </div>
          </div>
        </header>

        {/* --- BANNER COMO ZONA DE SOLTAR (DROP) --- */}
        <Droppable droppableId="zona-carrito">
          {(provided, snapshot) => (
            <section 
              className={`main-banner ${snapshot.isDraggingOver ? 'drag-over-active' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="banner-content">
                <div className="timer-display" style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffeb3b', marginBottom: '5px' }}>
                  ⏳ Nuevas ofertas en: {formatTiempo(tiempo)}
                </div>
                <h2>BIENVENIDO, {sesionActiva.user.toUpperCase()}</h2>
                <p>CARRITO ({carrito.length})</p>
                <div className="cart-preview">
                  {carrito.length === 0 ? (
                    <p className="loading-animation">Selecciona o arrastra productos aquí...</p>
                  ) : (
                    <div className="cart-tags">
                      <AnimatePresence>
                        {carrito.map((item, index) => (
                          <motion.span 
                            key={`${item}-${index}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="cart-tag" 
                            onClick={() => eliminarDelCarrito(index)}
                          >
                            {item} <small>✕</small>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
              {provided.placeholder}
            </section>
          )}
        </Droppable>

        <nav className="nav-categories">
          <span className="active">Todo</span>
          <span>Tecnologia</span>
          <span>Moda</span>
          <span>Hogar</span>
        </nav>

        {/* --- TUS ICONOS SVG ORIGINALES --- */}
        <section className="action-icons">
          {[
            { name: 'Ofertas', img: ofertaIcon },
            { name: 'Afiliados', img: afiliadosIcon },
            { name: 'Play', img: playIcon },
            { name: 'Cupones', img: cuponesIcon },
            { name: 'Más', img: otrosIcon }
          ].map((item) => (
            <div key={item.name} className="action-item">
              <div className="icon-placeholder">
                <img src={item.img} alt={item.name} className="action-svg" />
              </div>
              <span>{item.name}</span>
            </div>
          ))}
        </section>

        <h3 style={{ padding: '0 15px', fontSize: '16px', marginTop: '10px' }}>Visto recientemente</h3>

        {/* --- GRID COMO ZONA DE ARRASTRE (DRAG) --- */}
        <Droppable droppableId="productos-grid" isDropDisabled={true}>
          {(provided) => (
            <section 
              className="products-grid" 
              ref={provided.innerRef} 
              {...provided.droppableProps}
            >
              {productos.map((prod, index) => (
                <Draggable key={prod.id} draggableId={prod.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      className={`product-card ${snapshot.isDragging ? 'dragging' : ''}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => agregarAlCarrito(prod.nombre)}
                    >
                      <div className="product-image-box skeleton"></div>
                      <p className="price">{prod.nombre}</p>
                      <p className="shipping">Arrastra al carrito</p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </section>
          )}
        </Droppable>

        {/* --- TU FOOTER ORIGINAL --- */}
        <footer className="tab-bar">
          <div className="tab-item"><span>🏠</span><small>Inicio</small></div>
          <div className="tab-item"><span>☰</span><small>Cat.</small></div>
          <div className="cart-fab pulse-orange">
            🛒 {carrito.length > 0 && <span className="cart-badge">{carrito.length}</span>}
          </div>
          <div className="tab-item"><span>⚡</span><small>Clips</small></div>
          <div className="tab-item"><span>...</span><small>Más</small></div>
        </footer>
      </div>
    </DragDropContext>
  )
}

export default App