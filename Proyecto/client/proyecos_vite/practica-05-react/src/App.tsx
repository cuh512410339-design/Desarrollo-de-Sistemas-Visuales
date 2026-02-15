import { useState, useEffect } from 'react'
import './App.css'
import LoginForm from './Login/LoginForm'
import RegistroForm from './Registro/RegistroForm' // Asegúrate de haber creado este archivo
import GestionUsuarios from './gestion/GestionUsuarios' // Ajusta la ruta si es necesario

import Cookies from 'js-cookie'; // ✅ Nueva
import EditarPerfil from './perfil/EditarPerfil'; // ✅ Nueva
import CheckoutForm from './compras/CheckoutForm'; // ✅ Nueva

import { motion, AnimatePresence } from 'framer-motion'; // Para animaciones
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'; // Para Drag & Drop

import EnProgreso from './construccion/EnProgreso';
// Iconos
import ofertaIcon from './assets/ofertas mern.svg'
import afiliadosIcon from './assets/afiliados mern.svg'
import playIcon from './assets/play mern.svg'
import cuponesIcon from './assets/cupones mern.svg'
import otrosIcon from './assets/otros mern.svg'

function App() {
  const [carrito, setCarrito] = useState<string[]>([]);
  const [sesionActiva, setSesionActiva] = useState<any>(null); 
  const [vistaActual, setVistaActual] = useState<'tienda' | 'perfil' | 'checkout' | 'progreso'>('tienda');
  const [verPanelAdmin, setVerPanelAdmin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [tiempo, setTiempo] = useState(7200); // 2 horas en segundos
    const formatTiempo = (segundos: number) => {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;

  // Si hay horas, mostramos H:MM:SS. Si no hay, podemos mostrar MM:SS
  if (h > 0) {
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

  // 1. CARGA INICIAL (Una sola vez)
  useEffect(() => {
    const token = Cookies.get('mern_token');
    const saved = localStorage.getItem('mern_session');
    const savedTime = localStorage.getItem('mern_timer');
    
    if (token && saved) {
      setSesionActiva(JSON.parse(saved));
      if (savedTime) setTiempo(parseInt(savedTime));
    }
  }, []);

  // 2. TEMPORIZADOR ÚNICO (Controlado por la sesión)
  useEffect(() => {
    if (!sesionActiva) return; // Si no hay sesión, no hay reloj

    const timer = setInterval(() => {
      setTiempo((prev) => {
        if (prev <= 1) {
          // Limpieza total al expirar
          Cookies.remove('mern_token');
          localStorage.removeItem('mern_session');
          localStorage.removeItem('mern_timer');
          setSesionActiva(null);
          setVistaActual('tienda');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Limpia el intervalo al desmontar o cerrar sesión
  }, [sesionActiva]); // Se reinicia solo si la sesión cambia

  // 3. PERSISTENCIA DEL TIEMPO
  useEffect(() => {
    if (sesionActiva) {
      localStorage.setItem('mern_timer', tiempo.toString());
    }
  }, [tiempo, sesionActiva]);

  // 4. PERSISTENCIA DEL CARRITO
  useEffect(() => {
    const guardado = localStorage.getItem('mern_carrito');
    if (guardado) setCarrito(JSON.parse(guardado));
  }, []);

  useEffect(() => {
    localStorage.setItem('mern_carrito', JSON.stringify(carrito));
  }, [carrito]);

  // ... funciones como formatTiempo y el resto del código ...
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
          <LoginForm onLoginSuccess={(datos: any) => {
            setSesionActiva(datos);
            setTiempo(7200); // ✅ Reinicia el tiempo a 2 horas
            localStorage.setItem('mern_timer', '7200'); // ✅ Limpia el tiempo viejo
          }} />
          
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
  // --- EL CEREBRO DE LA NAVEGACIÓN ---
  // Este bloque decide qué pantalla mostrar antes de cargar la tienda
  
  if (verPanelAdmin && sesionActiva?.role === 'admin') {
    return (
      <div className="admin-view-wrapper">
        <button onClick={() => setVerPanelAdmin(false)} className="btn-back-to-store" style={{margin:'20px'}}>⬅ Volver a la Tienda</button>
        <GestionUsuarios />
      </div>
    );
  }

  if (vistaActual === 'perfil') {
    return (
      <div className="admin-view-wrapper">
        <button onClick={() => setVistaActual('tienda')} className="btn-back-to-store" style={{margin:'20px'}}>⬅ Volver a la Tienda</button>
        <EditarPerfil />
      </div>
    );
  }

  if (vistaActual === 'checkout') {
    return (
      <div className="admin-view-wrapper">
        <button onClick={() => setVistaActual('tienda')} className="btn-back-to-store" style={{margin:'20px'}}>⬅ Volver a la Tienda</button>
        <CheckoutForm />
      </div>
    );
  }
   if (vistaActual === 'progreso') {
   return (
    <div className="admin-view-wrapper">
      {/* Le pasamos la función que cambia el estado a tienda */}
      <EnProgreso onBack={() => setVistaActual('tienda')} />
    </div>
  );
}

  // Si no entra en ninguno de los anteriores, ejecuta el return de abajo (la tienda)
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
                ⚙️ Gestionar
              </button>
            )}

            {/* 2. TU NOMBRE DE USUARIO, RANGO Y SALIR */}
<div 
  className="location" 
  style={{ cursor: 'default', color: 'white', display: 'flex', alignItems: 'center' }}
>
  <span style={{ fontWeight: 'bold' }}>{sesionActiva?.user}</span>
  
  {/* Etiqueta de Rol Dinámica */}
  <span className={`badge-role role-${sesionActiva?.role || 'cliente'}`}>
    {sesionActiva?.role || 'cliente'}
  </span>

  <span 
    onClick={() => { 
      Cookies.remove('mern_token');
      localStorage.removeItem('mern_session'); 
      localStorage.removeItem('mern_carrito'); 
      localStorage.removeItem('mern_timer');
      localStorage.removeItem('perfil_usuario_datos');
      
      setSesionActiva(null); 
      setTiempo(7200); 
      setVerPanelAdmin(false); 
      setVistaActual('tienda');
    }}
    style={{ marginLeft: '15px', fontSize: '10px', opacity: 0.8, cursor: 'pointer' }}
  >
    | Salir
  </span>
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
    ⏳ Tu sesión expira en: {formatTiempo(tiempo)}
  </div>
  <h2>
    {vistaActual === 'tienda' ? `HOLA, ${sesionActiva?.user.toUpperCase()}` : 
     vistaActual === 'perfil' ? 'MI PERFIL' : 'FINALIZAR COMPRA'}
  </h2>
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
    <div 
      key={item.name} 
      className="action-item" 
      onClick={() => setVistaActual('progreso')} // ⬅️ ESTA ES LA CLAVE
      style={{ cursor: 'pointer' }}
    >
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
          <div className="tab-item" onClick={() => setVistaActual('tienda')}>
            <span>🏠</span><small>Inicio</small>
          </div>
          
          <div className="tab-item" onClick={() => setVistaActual('perfil')}>
            <span>👤</span><small>Perfil</small>
          </div>
          
          <div className="cart-fab pulse-orange" onClick={() => setVistaActual('checkout')}>
            🛒 {carrito.length > 0 && <span className="cart-badge">{carrito.length}</span>}
          </div>
          
          <div className="tab-item" onClick={() => setVistaActual('progreso')}>
            <span>⚡</span><small>Clips</small>
          </div>
          <div className="tab-item" onClick={() => setVistaActual('progreso')}>
            <span>...</span><small>Más</small>
          </div>
        </footer>
      </div> {/* Cierra el <div className="container"> */}
    </DragDropContext> // Cierra el DragDropContext
  ); // Cierra el return
} // Cierra la function App()

export default App;