import { useState, useEffect, useMemo } from 'react';
import './CheckoutForm.css';
import { jsPDF } from "jspdf";

interface DatosEnvio {
  nombreCompleto: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  metodoPago: 'tarjeta' | 'efectivo' | 'transferencia';
}

export default function CheckoutForm() {
  const [datos, setDatos] = useState<DatosEnvio>({
    nombreCompleto: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    metodoPago: 'tarjeta'
  });

  const [mensajeStatus, setMensajeStatus] = useState<string | null>(null);

  // --- 1. REQUISITO: ESTADO BORRADOR (Recuperar al cargar) ---
  useEffect(() => {
    const borrador = localStorage.getItem('borrador_checkout');
    if (borrador) {
      setDatos(JSON.parse(borrador));
    }
  }, []);

  // --- 2. REQUISITO: ESTADO BORRADOR (Guardar al escribir) ---
  useEffect(() => {
    localStorage.setItem('borrador_checkout', JSON.stringify(datos));
  }, [datos]);

  // --- 3. REGLAS DE NEGOCIO (Validaciones Frontend) ---
  const esValido = useMemo(() => {
    return (
      datos.nombreCompleto.length > 5 &&
      datos.direccion.length > 10 &&
      /^\d{5}$/.test(datos.codigoPostal) // Valida exactamente 5 números
    );
  }, [datos]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // --- 4. EXPORTACIÓN PDF (Requisito Técnico) ---
  const generarTicketPDF = (datosFinales: DatosEnvio) => {
    const doc = new jsPDF();
    
    // Diseño del PDF
    doc.setFillColor(46, 125, 50); // Verde oscuro profesional
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("COMPROBANTE DE PEDIDO", 20, 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Fecha de compra: ${new Date().toLocaleString()}`, 20, 50);
    doc.line(20, 55, 190, 55);

    doc.setFont("helvetica", "bold");
    doc.text("Información del Cliente:", 20, 70);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${datosFinales.nombreCompleto}`, 25, 80);
    doc.text(`Dirección: ${datosFinales.direccion}`, 25, 90);
    doc.text(`Ciudad: ${datosFinales.ciudad} (CP: ${datosFinales.codigoPostal})`, 25, 100);

    doc.setFont("helvetica", "bold");
    doc.text("Resumen de Pago:", 20, 120);
    doc.setFont("helvetica", "normal");
    doc.text(`Método seleccionado: ${datosFinales.metodoPago.toUpperCase()}`, 25, 130);
    doc.text(`Estado: Confirmado`, 25, 140);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Gracias por su preferencia. Conserve este ticket para cualquier aclaración.", 20, 200);

    // Guardar archivo
    doc.save(`Ticket_Comprobante_${datosFinales.nombreCompleto.replace(/\s/g, '_')}.pdf`);
  };

  // --- 5. PERSISTENCIA EN MONGODB ---
  const procesarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Aquí enviarías los datos a tu endpoint real de pedidos
      console.log("Enviando pedido a :", datos);

      // Si la respuesta es OK:
      generarTicketPDF(datos); // Descarga el PDF
      setMensajeStatus("🚀 ¡Pedido guardado Ticket generado!");
      
      // Limpiamos el borrador ya que el proceso terminó
      localStorage.removeItem('borrador_checkout');
      
      // Reseteamos el formulario
      setDatos({
        nombreCompleto: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        metodoPago: 'tarjeta'
      });

      // Quitamos el mensaje después de unos segundos
      setTimeout(() => setMensajeStatus(null), 5000);

    } catch (error) {
      setMensajeStatus("❌ Error al procesar el pedido en el servidor");
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h2>Finalizar Compra</h2>
        <p className="subtitle">Formulario de Pago y Envío</p>

        {mensajeStatus && (
          <div className={`status-banner ${mensajeStatus.includes('🚀') ? 'success' : 'error'}`}>
            {mensajeStatus}
          </div>
        )}

        <form onSubmit={procesarCompra}>
          <div className="campo-container">
            <label>Nombre Completo</label>
            <input 
              name="nombreCompleto" 
              placeholder="Ej. Juan Pérez"
              value={datos.nombreCompleto} 
              onChange={manejarCambio} 
              required 
            />
          </div>

          <div className="campo-container">
            <label>Dirección de Envío</label>
            <input 
              name="direccion" 
              placeholder="Calle, número y colonia"
              value={datos.direccion} 
              onChange={manejarCambio} 
              required 
            />
          </div>

          <div className="grupo-input">
            <div className="campo-container">
              <label>Ciudad</label>
              <input 
                name="ciudad" 
                value={datos.ciudad} 
                onChange={manejarCambio} 
                required 
              />
            </div>
            <div className="campo-container">
              <label>Código Postal</label>
              <input 
                name="codigoPostal" 
                value={datos.codigoPostal} 
                onChange={manejarCambio} 
                placeholder="5 dígitos" 
                maxLength={5}
                required 
              />
            </div>
          </div>

          <div className="campo-container">
            <label>Método de Pago</label>
            <select name="metodoPago" value={datos.metodoPago} onChange={manejarCambio}>
              <option value="tarjeta">💳 Tarjeta de Crédito/Débito</option>
              <option value="efectivo">💵 Efectivo (OXXO/Seven)</option>
              <option value="transferencia">🏦 Transferencia Bancaria</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-confirmar" 
            disabled={!esValido}
          >
            {esValido ? 'Confirmar y Descargar Ticket' : 'Completa los campos'}
          </button>
        </form>
      </div>
    </div>
  );
}