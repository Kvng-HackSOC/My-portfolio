import mysql from 'mysql2/promise';
import { config } from '@/lib/config';
import logger from '@/lib/logger';

// Parse the connection string manually
const parseConnectionString = (connectionString: string) => {
  try {
    // Expected format: mysql://username:password@hostname:port/database
    const url = new URL(connectionString);
    const username = url.username;
    const password = url.password;
    const hostname = url.hostname;
    const port = parseInt(url.port || '3306', 10);
    const database = url.pathname.substring(1); // Remove leading slash

    return { username, password, hostname, port, database };
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to parse database connection string', { error: err.message });
    throw error;
  }
};

const createPool = () => {
  try {
    logger.info('Attempting to connect to database...');

    const { username, password, hostname, port, database } = parseConnectionString(config.database.url);
    
    return mysql.createPool({
      host: hostname,
      user: username,
      password: password,
      database: database,
      port: port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  } catch (error) {
    console.error('Failed to create database connection pool:', error);
    throw error;
  }
};

const pool = createPool();

// Verify database connection
const verifyConnection = async () => {
  try {
    const [result] = await pool.query('SELECT 1 as connection_test');
    logger.info('Database connection successful', { result });
    return true;
  } catch (error) {
    const err = error as Error;
    logger.error('Database connection failed', { error: err.message });
    return false;
  }
};

// Export the connection pool and verification function
export { verifyConnection };
export default pool;