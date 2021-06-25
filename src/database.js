//Importar la base de datos de mysql
const mysql = require('mysql');

const { promisify } = require('util');

const { database } = require('./keys'); //solo importar database

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            consoles.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            consoles.error('DATABASE HAS TOO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            consoles.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if (connection) connection.release();
    console.log('DB is connected');
    return;
});

// promisify pool querys - > convertir a promesas lo que antes era coolbax
pool.query = promisify(pool.query);

module.exports = pool;