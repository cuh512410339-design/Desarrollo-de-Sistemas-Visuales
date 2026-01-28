import { useState, useEffect } from 'react'
import './App.css'
import LoginForm from './Login/LoginForm'

// Iconos
import ofertaIcon from './assets/ofertas mern.svg'
import afiliadosIcon from './assets/afiliados mern.svg'
import playIcon from './assets/play mern.svg'
import cuponesIcon from './assets/cupones mern.svg'
import otrosIcon from './assets/otros mern.svg'

function App() {
  const [carrito, setCarrito] = useState<string[]>([]);
  // Nuevo estado para controlar si el usuario entró
  const [sesionActiva, setSesionActiva] = useState<any>(null);

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

  // --- PASO 1: LÓGICA DE BLOQUEO ---
  // Si no hay sesión activa, mostramos ÚNICAMENTE el login
  if (!sesionActiva) {
    return (
      <div className="login-wrapper">
        <LoginForm onLoginSuccess={(datos: any) => setSesionActiva(datos)} />
      </div>
    );
  }

  // --- PASO 2: INTERFAZ PRINCIPAL ---
  // Solo se llega aquí si sesionActiva tiene datos
  return (
    <div className="container">
      <header className="header">
        <div className="search-bar">
          <span className="icon">🔍</span>
          <input type="text" placeholder={`Buscar`} disabled />
        </div>
        <div 
          className="location" 
          onClick={() => { localStorage.removeItem('mern_session'); setSesionActiva(null); }}
          style={{ cursor: 'pointer', color: 'white' }}
        >
          {sesionActiva.user} ||  Salir 
        </div>
      </header>

      <section className="main-banner">
        <div className="banner-content">
          <h2>BIENVENIDO, {sesionActiva.user.toUpperCase()}</h2>
          <p>CARRITO ({carrito.length})</p>
          <div className="cart-preview">
            {carrito.length === 0 ? (
              <p className="loading-animation">Agrega productos para comenzar...</p>
            ) : (
              <div className="cart-tags">
                {carrito.map((item, index) => (
                  <span key={index} className="cart-tag" onClick={() => eliminarDelCarrito(index)}>
                    {item} <small>✕</small>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navegación e Iconos (Se mantienen igual) */}
      <nav className="nav-categories">
        <span className="active">Todo</span>
        <span>Tecnologia</span>
        <span>Moda</span>
        <span>Hogar</span>
      </nav>

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
      <section className="products-grid">
        {productos.map((prod) => (
          <div key={prod.id} className="product-card" onClick={() => agregarAlCarrito(prod.nombre)}>
            <div className="product-image-box skeleton"></div>
            <p className="price">Sugerido para ti</p>
            <p className="shipping">Agregar al carrito</p>
          </div>
        ))}
      </section>

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
  )
  
}

export default App