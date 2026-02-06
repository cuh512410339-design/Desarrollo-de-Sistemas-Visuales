const mongoose = require('mongoose');

// Le damos un valor por defecto por si process.env.MONGO_URI falla
async function conectarBaseDeDatos(uriMongo = process.env.MONGO_URI){
    try {
        // Fallback: Si no hay URI en el env ni en el parámetro, usamos localhost
        const conexionURI = uriMongo || "mongodb://127.0.0.1:27017/notas_db";
        
        await mongoose.connect(conexionURI);
        console.log("✅ Conexión a la base de datos exitosa");
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error);
        process.exit(1); 
    }
}

module.exports = conectarBaseDeDatos;