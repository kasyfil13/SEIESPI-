const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'seiespi'
};

async function getConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database!');
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

module.exports = getConnection;