const pkg = require('pg')
const { Pool } = pkg;
const dotenv = require('dotenv')
dotenv.config();


class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }

      this.pool = new Pool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          port: process.env.DB_PORT
      });
      DatabaseConnection.instance = this;
    }

    async query(sql, params) {
      return this.pool.query(sql, params);
    }
  }

module.exports = new DatabaseConnection();