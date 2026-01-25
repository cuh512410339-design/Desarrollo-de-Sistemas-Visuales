import { useState } from 'react' // Importamos useState para manejar el carrito
import './App.css'
import ofertaIcon from './assets/ofertas mern.svg'
import afiliadosIcon from './assets/afiliados mern.svg'
import playIcon from './assets/play mern.svg'
import cuponesIcon from './assets/cupones mern.svg'
import otrosIcon from './assets/otros mern.svg'

function App() {
  // Estado para almacenar los nombres de los productos en el carrito
  const [carrito, setCarrito] = useState<string[]>([]);

  const productos = [
    { id: 1, nombre: 'Producto 1' },
    { id: 2, nombre: 'Producto 2' },
    { id: 3, nombre: 'Producto 3' },
    { id: 4, nombre: 'Producto 4' },
    { id: 5, nombre: 'Producto 5' },
    { id: 6, nombre: 'Producto 6' },
  ];

  // Función para agregar
  const agregarAlCarrito = (nombre: string) => {
    setCarrito([...carrito, nombre]);
  };

  // Función para eliminar un producto específico por su posición (index)
  const eliminarDelCarrito = (indexAEliminar: number) => {
    setCarrito(carrito.filter((_, index) => index !== indexAEliminar));
  };

  return (
    <div className="container">
      <header className="header">
        <div className="search-bar">
          <span className="icon">🔍</span>
          <input type="text" placeholder="Buscador en proceso..." disabled />
        </div>
        <div className="location loading-animation">📍 En proceso...</div>
      </header>

      <nav className="nav-categories">
        <span className="active">Todo</span>
        <span>Celulares</span>
        <span>Moda</span>
        <span>Hogar</span>
        <span>Belleza</span>
        <span>Vehículos</span>
      </nav>

      {/* 3. Banner Principal convertido en Carrito */}
      <section className="main-banner">
        <div className="banner-content">
          <h2>CARRITO ({carrito.length})</h2>
          <div className="cart-preview">
            {carrito.length === 0 ? (
              <p className="loading-animation">Haz clic abajo para agregar productos...</p>
            ) : (
              <div className="cart-tags">
                {carrito.map((item, index) => (
                  <span 
                    key={index} 
                    className="cart-tag" 
                    onClick={() => eliminarDelCarrito(index)}
                  >
                    {item} <small>✕</small>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

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
          <div 
            key={prod.id} 
            className="product-card" 
            onClick={() => agregarAlCarrito(prod.nombre)}
          >
            <div className="product-image-box skeleton"></div>
            <p className="price">En proceso...</p>
            <p className="shipping">Agregar al carrito</p>
          </div>
        ))}
      </section>

      <footer className="tab-bar">
        <div className="tab-item"><span>🏠</span><small>Inicio</small></div>
        <div className="tab-item"><span>☰</span><small>Cat.</small></div>
        <div className="cart-fab pulse-orange">
          🛒
          {carrito.length > 0 && <span className="cart-badge">{carrito.length}</span>}
        </div>
        <div className="tab-item"><span>⚡</span><small>Clips</small></div>
        <div className="tab-item"><span>...</span><small>Más</small></div>
      </footer>
    </div>
  )
}

export default App