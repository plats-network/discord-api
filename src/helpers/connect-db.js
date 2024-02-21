const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }

        this.pool = mysql2.createPool({
            connectionLimit: 100,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            waitForConnections: true,
            queueLimit: 0
        });

        DatabaseConnection.instance = this;
    }

    async query(sql, params) {
        const connection = await this.pool.getConnection();
        try {
            const [results, fields] = await connection.execute(sql, params);
            return results;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = new DatabaseConnection();
