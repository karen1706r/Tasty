// db.js
const { Pool } = require('pg'); // Importa Pool desde el paquete pg

// Crea una nueva instancia de Pool con la configuración
const pool = new Pool({
    user: 'postgres', // Tu nombre de usuario de PostgreSQL
    host: 'db.moukbcyzsmfqnseseknw.supabase.co',
    database: 'postgres',
    password: 'tasty', // Tu contraseña de PostgreSQL
    port: 5432,
});

// Función para realizar consultas a la base de datos
const query = (text, params) => {
    return pool.query(text, params);
};

// Exporta el pool para usar en otras partes de la aplicación
module.exports = { query };
