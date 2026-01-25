import './App.css'
// Importación de tus iconos SVG
import ofertaIcon from './assets/ofertas mern.svg'
import afiliadosIcon from './assets/afiliados mern.svg'
import playIcon from './assets/play mern.svg'
import cuponesIcon from './assets/cupones mern.svg'
import otrosIcon from './assets/otros mern.svg'

function App() {
  // Lista de productos con estado inicial "En proceso..."
  const productos = [
    { id: 1, precio: 'En proceso...', desc: 'En proceso...', color: '#f0f0f0' },
    { id: 2, precio: 'En proceso...', desc: 'En proceso...', color: '#f9f9f9' },
    { id: 3, precio: 'En proceso...', desc: 'En proceso...', color: '#eee' },
    { id: 4, precio: 'En proceso...', desc: 'En proceso...', color: '#f0f0f0' },
    { id: 5, precio: 'En proceso...', desc: 'En proceso...', color: '#f9f9f9' },
    { id: 6, precio: 'En proceso...', desc: 'En proceso...', color: '#eee' },
  ];

  return (
    <div className="container">
      {/* 1. Header con Buscador y Ubicación */}
      <header className="header">
        <div className="search-bar">
          <span className="icon">🔍</span>
          <input type="text" placeholder="Buscador en proceso..." disabled />
        </div>
        <div className="location loading-animation">📍 En proceso...</div>
      </header>

      {/* 2. Barra de Categorías */}
      <nav className="nav-categories">
        <span className="active">Todo</span>
        <span>Celulares</span>
        <span>Moda</span>
        <span>Hogar</span>
        <span>Belleza</span>
        <span>Vehículos</span>
      </nav>

      {/* 3. Banner Principal */}
      <section className="main-banner">
        <div className="banner-content">
          <h2>OFERTAS</h2>
          <p className="highlight loading-animation">En proceso...</p>
          <p className="msi loading-animation">En proceso...</p>
        </div>
      </section>

      {/* 4. Botones de Acción (Círculos con SVGs) */}
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

      {/* 5. Grid de Productos con Efecto Skeleton */}
      <h3 style={{ padding: '0 15px', fontSize: '16px', marginTop: '10px' }}>Visto recientemente</h3>
      <section className="products-grid">
        {productos.map((prod) => (
          <div key={prod.id} className="product-card">
            <div className="product-image-box skeleton"></div>
            <p className="price loading-animation">{prod.precio}</p>
            <p className="shipping loading-animation">{prod.desc}</p>
          </div>
        ))}
      </section>

      {/* 6. Barra Inferior Fija (Tab Bar) */}
      <footer className="tab-bar">
        <div className="tab-item"><span>🏠</span><small>Inicio</small></div>
        <div className="tab-item"><span>☰</span><small>Cat.</small></div>
        <div className="cart-fab pulse-orange">🛒</div>
        <div className="tab-item"><span>⚡</span><small>Clips</small></div>
        <div className="tab-item"><span>...</span><small>Más</small></div>
      </footer>
    </div>
  )
}

export default App