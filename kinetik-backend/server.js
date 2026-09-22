/*
 * ===================================================================
 * KINETIK - MAIN SERVER (server.js)
 * ===================================================================
 *
 * This is your new main server file.
 * Its only job is to start the server and load the routes.
 *
 */

// --- 1. Imports ---
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import your route files
import userRoutes from './routes/user.js';
import nutritionRoutes from './routes/nutrition.js';
import exerciseRoute from './routes/exercise.js';   // <-- CORRECT PLACE

// --- 2. Configuration & Setup ---
const app = express();

// IMPORTANT: Increase the body limit to allow for base64 images
app.use(express.json({ limit: '10mb' }));
app.use(cors());

const PORT = process.env.PORT || 3000;

import pool from './db.js';

// Health check and root route (required for Render)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.json({ message: 'Kinetik Backend API is live!', status: 'running' });
});

// Database connectivity test endpoint
app.get('/api/db-test', async (req, res) => {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        res.json({ status: 'connected', tables: rows });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ status: 'error', error: err.message, code: err.code });
    }
});

// --- 3. Load Routes ---
app.use('/api/user', userRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/exercises', exerciseRoute);      // <-- CORRECT PLACE

// --- 4. Start the Server ---
app.listen(PORT, () => {
    console.log(`
============================================================
 Kinetik Backend Server is RUNNING! (Multi-File Structure)
 
 API Endpoints:
 - http://localhost:${PORT}/api/user/get-user-data
 - http://localhost:${PORT}/api/nutrition/search
 - http://localhost:${PORT}/api/nutrition/log
 - http://localhost:${PORT}/api/nutrition/identify
 - http://localhost:${PORT}/api/nutrition/summary
 - http://localhost:${PORT}/api/exercises         <-- NEW
============================================================
    `);
});
