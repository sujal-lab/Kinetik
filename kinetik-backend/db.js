/*
 * ===================================================================
 * KINETIK - DATABASE CONNECTION (db.js)
 * ===================================================================
 *
 * This file has ONE job: create and export the database connection.
 * All other files (user.js, nutrition.js) will import from here.
 *
 */

import mysql from 'mysql2/promise';
import 'dotenv/config';

// Priority order:
// 1. Connection URL (MYSQL_URL or DATABASE_URL)
// 2. Individual environment variables (DB_HOST / MYSQLHOST, etc.)
// 3. Fallback credentials for direct access
const pool = process.env.MYSQL_URL || process.env.DATABASE_URL
    ? mysql.createPool(process.env.MYSQL_URL || process.env.DATABASE_URL)
    : mysql.createPool({
        host: process.env.DB_HOST || process.env.MYSQLHOST || 'caboose.proxy.rlwy.net',
        user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
        password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || 'dSgblCyJflolPhijcCsZlOdTcFLrvRdf',
        database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway',
        port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 33444),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

// Export the pool so other files can use it
export default pool;