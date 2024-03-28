// import mysql from "promise-mysql"
// import config  from "./../config"
//
// const connection = mysql.createConnection({
// host: config.host,
// port: config.port,
// database: config.database,
// user: config.user,
// password: config.password,
// authPlugin: 'mysql_native_password'
// })
//
// const getConnection=()=>{
// return connection;
// }
//
// module.exports = {
// getConnection
// };

// import mysql from "mysql2/promise"; // Importar mysql2 en lugar de promise-mysql
// import config from "./../config";

// let pool;

// const createPool = async () => {
//     pool = mysql.createPool({
//         host: config.host,
//         port: config.port,
//         database: config.database,
//         user: config.user,
//         password: config.password,
//         waitForConnections: true, // Esperar conexiones si todas están en uso
//         connectionLimit: 10, // Límite máximo de conexiones en el pool
//         queueLimit: 0 // Límite máximo de conexiones en espera (0 para ilimitado)
//     });
// };

// const getPool = () => {
//     if (!pool) {
//         throw new Error("El pool de conexiones no ha sido creado. Llama a createPool primero.");
//     }
//     return pool;
// };

// export { createPool, getPool };
