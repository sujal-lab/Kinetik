/*
 * ===================================================================
 * KINETIK - USER API ROUTES (routes/user.js)
 * ===================================================================
 *
 * This file contains all API endpoints related to a USER.
 * This is your file to manage.
 *
 */

import { Router } from 'express';
import pool from '../db.js'; // Import the database connection

const router = Router(); // Create a new router

// --- 1. The User Data API Endpoint ---
// Note: The path is now just '/get-user-data'
// The full URL will be: http://localhost:3000/api/user/get-user-data
router.get('/get-user-data', async (req, res) => {
    
    console.log("Received request for /api/user/get-user-data");

    //
    // !! MOCKED USER ID !!
    //
    const userId = 1; // <-- This is still your mock!

    try {
        // --- STEP 1: Get User Data From DB ---
        console.log(`Fetching data for (mocked) user_id: ${userId}`);
        const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);

        if (rows.length === 0) {
            console.error(`Error: Test user with ID ${userId} not found.`);
            return res.status(404).json({ error: `User with ID ${userId} not found. Did you run test_user.sql?` });
        }
        
        const user = rows[0];
        console.log("Successfully fetched user data.");
        
        // --- STEP 2: Send the user data back to the frontend ---
        res.json(user);

    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
});

// (Later, you will add more routes here, like this)
/*
router.put('/update-profile', async (req, res) => {
    // Code to update user profile
});
*/

// Export the router so server.js can use it
export default router;