const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // XAMPP mặc định để trống
    database: 'tinhocnguyentrinh',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();