import './EnProgreso.css';
import ofertaIcon from '../assets/construccion.svg'; // Verifica que la ruta sea correcta según tu carpeta

interface EnProgresoProps {
  onBack: () => void;
}

export default function EnProgreso({ onBack }: EnProgresoProps) {
  return (
    <div className="progress-container fade-in">
      <div className="progress-card">
        {/* Mostramos tu archivo SVG de construcción */}
        <div className="svg-container">
          <img src={ofertaIcon} alt="En construcción" className="svg-build-icon" />
        </div>
        
        <h1 className="status-title">No disponible</h1>
        <p className="status-text">Esta parte de la aplicación no esta disponible.</p>
        
        <div className="progress-loader">
          <div className="loader-bar"></div>
        </div>

        <button 
          className="btn-back-to-store" 
          onClick={onBack}
        >
          ⬅ Volver Atrás
        </button>
      </div>
    </div>
  );
}