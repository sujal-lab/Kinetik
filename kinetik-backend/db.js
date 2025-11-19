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

//
// !! =============================================================== !!
// !!                      ENTER YOUR DB CREDS HERE                   !!
// !!  This is the *only* file where you need to put your DB credentials. !!
// !! =============================================================== !!
//
const dbConfig = {
    host: 'caboose.proxy.rlwy.net',      // e.g., 'caboose.proxy.rlwy.net'
    user: 'root',                    // e.g., 'root'
    password: 'dSgblCyJflolPhijcCsZlOdTcFLrvRdf',
    database: 'railway',            // e.g., 'railway'
    port: '33444',    // e.g., '12345' (This is a number)
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create a connection "pool" (a collection of reusable connections)
const pool = mysql.createPool(dbConfig);

// Export the pool so other files can use it
export default pool;