import { useState, useMemo } from 'react';

// --- 1. COMPONENTES CON PROPS ---

// Componente Reutilizable para Inputs (Recibe Props)
interface InputProps {
  label: string;
  valor: string;
  cambiarValor: (val: string) => void;
  tipo?: string;
  error: boolean;
}

const CampoForm = ({ label, valor, cambiarValor, tipo = "text", error }: InputProps) => (
  <div style={{ marginBottom: '15px', textAlign: 'left' }}>
    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px', fontWeight: 'bold' }}>
      {label}
    </label>
    <input
      type={tipo}
      value={valor}
      onChange={(e) => cambiarValor(e.target.value)}
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: `2px solid ${error ? '#ff4d4d' : '#ccc'}`,
        outline: 'none',
        boxSizing: 'border-box'
      }}
    />
  </div>
);

// Componente de Barra de Progreso (Recibe Props)
const BarraGUI = ({ porcentaje, color, etiqueta }: { porcentaje: number; color: string; etiqueta: string }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
      <span>{etiqueta}</span>
      <span>{porcentaje}%</span>
    </div>
    <div style={{ width: '100%', backgroundColor: '#ddd', borderRadius: '10px', height: '12px' }}>
      <div style={{ 
        width: `${porcentaje}%`, 
        backgroundColor: color, 
        height: '100%', 
        borderRadius: '10px', 
        transition: 'width 0.4s ease-in-out' 
      }} />
    </div>
  </div>
);

// --- 2. COMPONENTE PRINCIPAL ---

export default function App() {
  // Estados de datos
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de control
  const [temaClaro, setTemaClaro] = useState(true);
  const [progresoGuardado, setProgresoGuardado] = useState(0);
  const [estaGuardando, setEstaGuardando] = useState(false);

  // Validaciones dinámicas (Cálculo del progreso del formulario)
  const progresoLlenado = useMemo(() => {
    let puntos = 0;
    if (usuario.length >= 3) puntos += 34;
    if (correo.includes('@') && correo.length > 5) puntos += 33;
    if (password.length >= 6) puntos += 33;
    return puntos;
  }, [usuario, correo, password]);

  // Estilos de Tema
  const tema = {
    bg: temaClaro ? '#ffffff' : '#1a1a1a',
    texto: temaClaro ? '#333' : '#f0f0f0',
    card: temaClaro ? '#f9f9f9' : '#2d2d2d',
    boton: temaClaro ? '#4A90E2' : '#61dafb'
  };

  const guardarEnLocalStorage = (e: React.FormEvent) => {
    e.preventDefault();
    setEstaGuardando(true);

    // Simulación de "Progreso de almacenamiento"
    let avance = 0;
    const intervalo = setInterval(() => {
      avance += 20;
      setProgresoGuardado(avance);
      
      if (avance >= 100) {
        clearInterval(intervalo);
        
        // Almacenamiento real
        const nuevoRegistro = { usuario, correo, fecha: new Date().toLocaleDateString() };
        const previos = JSON.parse(localStorage.getItem('registros_gui') || '[]');
        localStorage.setItem('registros_gui', JSON.stringify([...previos, nuevoRegistro]));

        alert('¡Datos guardados con éxito en LocalStorage!');
        
        // Reset
        setEstaGuardando(false);
        setProgresoGuardado(0);
        setUsuario(''); setCorreo(''); setPassword('');
      }
    }, 300);
  };

  return (
    <div style={{ 
      backgroundColor: tema.bg, 
      color: tema.texto, 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      padding: '40px',
      transition: '0.3s all'
    }}>
      
      <button 
        onClick={() => setTemaClaro(!temaClaro)}
        style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer' }}
      >
        Cambiar a Tema {temaClaro ? 'Oscuro' : 'Claro'}
      </button>

      <div style={{ 
        backgroundColor: tema.card, 
        padding: '30px', 
        borderRadius: '15px', 
        width: '100%', 
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0 }}>Registro GUI</h2>

        {/* Barra de Progreso del Formulario */}
        <BarraGUI 
          porcentaje={progresoLlenado} 
          color={progresoLlenado === 100 ? '#4CAF50' : '#FF9800'} 
          etiqueta="Completado del Formulario"
        />

        <form onSubmit={guardarEnLocalStorage}>
          <CampoForm 
            label="Usuario (min. 3)" 
            valor={usuario} 
            cambiarValor={setUsuario} 
            error={usuario.length > 0 && usuario.length < 3}
          />
          <CampoForm 
            label="Email (debe llevar @)" 
            valor={correo} 
            cambiarValor={setCorreo} 
            tipo="email"
            error={correo.length > 0 && !correo.includes('@')}
          />
          <CampoForm 
            label="Contraseña (min. 6)" 
            valor={password} 
            cambiarValor={setPassword} 
            tipo="password"
            error={password.length > 0 && password.length < 6}
          />

          {/* Barra de Progreso de Almacenamiento (Simulación) */}
          {estaGuardando && (
            <BarraGUI 
              porcentaje={progresoGuardado} 
              color="#2196F3" 
              etiqueta="Guardando datos..." 
            />
          )}

          <button 
            type="submit" 
            disabled={progresoLlenado < 100 || estaGuardando}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: progresoLlenado === 100 ? tema.boton : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: progresoLlenado === 100 ? 'pointer' : 'not-allowed'
            }}
          >
            {estaGuardando ? 'Almacenando...' : 'Registrar Datos'}
          </button>
        </form>
      </div>
    </div>
  );
}