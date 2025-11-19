/*
 * ===================================================================
 * KINETIK - NUTRITION API ROUTES (routes/nutrition.js) (FIXED)
 * ===================================================================
 *
 * This file contains all API endpoints for the nutrition page.
 *
 * FIXES:
 * 1. `POST /log`: Now correctly inserts the `meal_type`.
 * 2. `GET /summary`: Fixed a typo in the SQL query.
 * 3. `GET /logs`: New endpoint to get all logs for the day.
 * 4. `DELETE /log/:log_id`: New endpoint to delete a log item.
 *
 * NOTE: AI logic has been MOVED to the frontend (Nutrition.html)
 * to fix the 403 API key error.
 *
 */

import { Router } from 'express';
import pool from '../db.js'; // Import the database connection

const router = Router();

// --- 1. SEARCH FOR FOOD ---
// GET /api/nutrition/search?name=...
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        // Use LIKE to find any food that contains the name
        const [foods] = await pool.query(
            'SELECT * FROM foods WHERE name LIKE ?', 
            [`%${name}%`]
        );
        res.json(foods);
    } catch (error) {
        console.error('Error searching foods:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});


// --- 2. LOG A MEAL (FIXED) ---
// POST /api/nutrition/log
router.post('/log', async (req, res) => {
    try {
        const { user_id, food_id, quantity, date, meal_type } = req.body;

        // 1. Insert the new log
        const [result] = await pool.query(
            'INSERT INTO user_meal_log (user_id, food_id, quantity, log_date, meal_type) VALUES (?, ?, ?, ?, ?)',
            [user_id, food_id, quantity, date, meal_type]
        );
        
        const newLogId = result.insertId;

        // 2. Get the nutritional info for the logged food
        const [foods] = await pool.query('SELECT * FROM foods WHERE food_id = ?', [food_id]);
        if (foods.length === 0) {
            return res.status(404).json({ error: 'Food not found' });
        }
        const food = foods[0];
        
        // 3. Calculate new totals
        const calories = food.calories * quantity;
        const protein = food.protein_g * quantity;
        const carbs = food.carbs_g * quantity;
        const fats = food.fats_g * quantity;

        // 4. Update the daily_summary table
        // This command will create a new row if one doesn't exist for today,
        // or update the existing one if it does.
        await pool.query(
            `INSERT INTO daily_summary (user_id, summary_date, total_calories_consumed, total_protein_g, total_carbs_g, total_fats_g)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             total_calories_consumed = total_calories_consumed + VALUES(total_calories_consumed),
             total_protein_g = total_protein_g + VALUES(total_protein_g),
             total_carbs_g = total_carbs_g + VALUES(total_carbs_g),
             total_fats_g = total_fats_g + VALUES(total_fats_g)`,
            [user_id, date, calories, protein, carbs, fats]
        );

        // Send back just the new log_id
        res.status(201).json({ 
            log_id: newLogId
        });

    } catch (error) {
        console.error('Error logging meal:', error);
        res.status(500).json({ error: 'Failed to log meal' });
    }
});


// --- 3. GET DAILY SUMMARY (FIXED) ---
// GET /api/nutrition/summary?user_id=...&date=...
router.get('/summary', async (req, res) => {
    try {
        const { user_id, date } = req.query;

        const [rows] = await pool.query(
            'SELECT * FROM daily_summary WHERE user_id = ? AND summary_date = ?',
            [user_id, date]
        );

        if (rows.length === 0) {
            // No summary for today? Send back zeros.
            res.json({
                total_calories_consumed: 0,
                total_protein_g: 0,
                total_carbs_g: 0,
                total_fats_g: 0
            });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// --- 4. GET ALL LOGS FOR THE DAY (NEW) ---
// GET /api/nutrition/logs?user_id=...&date=...
router.get('/logs', async (req, res) => {
    try {
        const { user_id, date } = req.query;
        // Join with the foods table to get the name and serving description
        const [logs] = await pool.query(
            `SELECT 
                l.log_id, l.meal_type, l.quantity,
                f.name, f.calories, f.serving_desc,
                (f.calories * l.quantity) as calories,
                (f.protein_g * l.quantity) as protein,
                (f.carbs_g * l.quantity) as carbs,
                (f.fats_g * l.quantity) as fat,
                CONCAT(FORMAT(l.quantity, 1), ' x ', f.serving_desc) as description
             FROM user_meal_log l
             JOIN foods f ON l.food_id = f.food_id
             WHERE l.user_id = ? AND l.log_date = ?
             ORDER BY l.log_id ASC`, // Ensures consistent order
            [user_id, date]
        );
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// --- 5. DELETE A LOG ITEM (NEW) ---
// DELETE /api/nutrition/log/:log_id
router.delete('/log/:log_id', async (req, res) => {
    try {
        const { log_id } = req.params;
        
        if (!log_id || isNaN(parseInt(log_id, 10))) {
             return res.status(400).json({ error: 'Invalid log ID' });
        }

        // 1. Get the log item *before* deleting it, so we can subtract its values
        const [logs] = await pool.query(
            `SELECT 
                l.user_id, l.log_date, l.quantity,
                f.calories, f.protein_g, f.carbs_g, f.fats_g
             FROM user_meal_log l
             JOIN foods f ON l.food_id = f.food_id
             WHERE l.log_id = ?`,
            [log_id]
        );
        
        if (logs.length === 0) {
            // This is not an error, it just means the log is already gone.
            return res.json({ message: 'Log item not found, but proceeding.' });
        }
        const log = logs[0];

        // 2. Delete the log item
        await pool.query('DELETE FROM user_meal_log WHERE log_id = ?', [log_id]);

        // 3. Calculate values to subtract
        const calories = log.calories * log.quantity;
        const protein = log.protein_g * log.quantity;
        const carbs = log.carbs_g * log.quantity;
        const fats = log.fats_g * log.quantity;

        // 4. Update the daily_summary
        await pool.query(
            `UPDATE daily_summary
             SET 
                total_calories_consumed = total_calories_consumed - ?,
                total_protein_g = total_protein_g - ?,
                total_carbs_g = total_carbs_g - ?,
                total_fats_g = total_fats_g - ?
             WHERE user_id = ? AND summary_date = ?`,
            [calories, protein, carbs, fats, log.user_id, log.log_date]
        );

        res.json({ message: 'Log item deleted successfully' });
    } catch (error) {
        console.error('Error deleting log item:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// AI 'identify' endpoint is no longer needed here, it's on the frontend.
// The frontend will call the /search endpoint with the AI's response.
function getLocalYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// --- 6. GET CALENDAR SUMMARY (FIXED) ---
// GET /api/nutrition/calendar-summary?user_id=...&endDate=...
router.get('/calendar-summary', async (req, res) => {
    try {
        const { user_id, endDate } = req.query; // endDate is 'YYYY-MM-DD'

        // 1. Calculate the date 35 days ago (for a 5x7 grid)
        const endDateObj = new Date(endDate); // Parses 'YYYY-MM-DD' as local
        const startDateObj = new Date(endDateObj);
        startDateObj.setDate(endDateObj.getDate() - 34);
        
        // --- FIX 1: Use the local date helper to avoid timezone bug ---
        const startDate = getLocalYYYYMMDD(startDateObj);

        // 2. Query the daily_summary table
        const [rows] = await pool.query(
            // --- FIX 2: Use DATE_FORMAT() to match frontend expectation ---
            `SELECT 
                DATE_FORMAT(summary_date, '%Y-%m-%d') AS summary_date,
                COALESCE(total_calories_consumed, 0) AS total_calories_consumed,
                COALESCE(total_calories_burned, 0) AS total_calories_burned,
                (COALESCE(total_calories_consumed, 0) > 0) as meal_logged,
                (COALESCE(total_calories_burned, 0) > 0) as exercise_logged
            FROM daily_summary
            WHERE 
                user_id = ? 
                AND summary_date BETWEEN ? AND ?`,
            [user_id, startDate, endDate]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error fetching calendar summary:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});


export default router;