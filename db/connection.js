const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'D00d13m4n2080@',
    database: 'election'
});

module.exports = db;