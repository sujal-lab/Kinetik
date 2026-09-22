// Central API configuration for Kinetik
// In production (e.g. on Render), VITE_API_URL will point to your deployed backend (e.g. https://kinetik-backend.onrender.com)
// In local development, it defaults to http://localhost:3000

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export default API_BASE_URL;
