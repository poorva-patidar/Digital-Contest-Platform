const { Pool } = require('pg');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_PORT } = require('../config/environment');

const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: NODE_PORT,
  max: 10,
  ssl: false,
});

module.exports = pool;