# 🚀 Kinetik Deployment Guide for Render

This guide walks you through deploying both the **Node.js Express Backend** and the **Vite React Frontend** to [Render](https://render.com) (100% Free Tier compatible).

Your MySQL database remains safely hosted on Railway (`caboose.proxy.rlwy.net:33444`), and the backend is already configured to connect to it automatically.

---

## ⚡ Method 1: Blueprint Deployment (Fastest / Recommended)

Render provides a Blueprint feature that reads `render.yaml` in this repository and provisions both services automatically.

1. **Commit and push** your changes to GitHub:
   ```bash
   git add .
   git commit -m "Configure Kinetik for Render deployment"
   git push origin main
   ```
2. Log into **[Render Dashboard](https://dashboard.render.com/)**.
3. Click **"New +"** in the top right and select **"Blueprint"**.
4. Connect your GitHub repository: `sujal-lab/Kinetik`.
5. Render will detect `render.yaml` and display the two services:
   - `kinetik-backend` (Node Web Service)
   - `kinetik-frontend` (Static Site)
6. Click **"Apply"**.
7. Once `kinetik-backend` finishes deploying, copy its Render URL (e.g. `https://kinetik-backend.onrender.com`).
8. Go to `kinetik-frontend` in your Render dashboard:
   - Click **"Environment"**.
   - Add environment variable:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://kinetik-backend.onrender.com` (replace with your backend's actual URL).
   - Click **"Save Changes"** to trigger a redeploy of the frontend.

---

## 🛠️ Method 2: Manual Setup via Render Dashboard

If you prefer to configure each service manually in the Render dashboard:

### Step 1: Deploy the Backend (Web Service)

1. In Render Dashboard, click **"New +"** → **"Web Service"**.
2. Select your repository `sujal-lab/Kinetik`.
3. Fill in the details:
   - **Name**: `kinetik-backend`
   - **Region**: Choose the region closest to your MySQL server (e.g. US East or US West).
   - **Root Directory**: `kinetik-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Expand **"Advanced"**:
   - **Health Check Path**: `/health`
   - **Environment Variables**:
     | Key | Value |
     |---|---|
     | `DB_HOST` | `caboose.proxy.rlwy.net` |
     | `DB_USER` | `root` |
     | `DB_PASSWORD` | `dSgblCyJflolPhijcCsZlOdTcFLrvRdf` |
     | `DB_NAME` | `railway` |
     | `DB_PORT` | `33444` |
5. Click **"Create Web Service"**.
6. Wait for deployment to finish. Test it in your browser:
   - `https://kinetik-backend.onrender.com/health` → Should show `{"status":"ok",...}`.
7. **Copy your Backend URL** (e.g., `https://kinetik-backend.onrender.com`).

---

### Step 2: Deploy the Frontend (Static Site)

1. In Render Dashboard, click **"New +"** → **"Static Site"**.
2. Select your repository `sujal-lab/Kinetik`.
3. Fill in the details:
   - **Name**: `kinetik` (or `kinetik-frontend`)
   - **Root Directory**: `kinetik-react`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add the **Environment Variable**:
   - Click **"Add Environment Variable"**:
     | Key | Value |
     |---|---|
     | `VITE_API_URL` | Your Backend URL from Step 1 (e.g., `https://kinetik-backend.onrender.com`) |
5. Expand **"Redirects/Rewrites"** (Optional, Render already picks up `public/_redirects`):
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
6. Click **"Create Static Site"**.
7. Once build completes, open your frontend URL (e.g. `https://kinetik.onrender.com`)!

---

## 🔍 Verification Checklist

- [ ] **Backend Health**: Visit `https://your-backend.onrender.com/health` and verify HTTP 200 JSON response.
- [ ] **Database Connection**: Visit `https://your-backend.onrender.com/api/user/get-user-data` to confirm it returns mock user data from your Railway MySQL database.
- [ ] **Frontend**: Open your frontend URL, navigate through Login, Dashboard, Nutrition, and Workout.
- [ ] **Page Refresh**: Refresh on any subroute (e.g. `/nutrition`) to verify that SPA rewrite works without a 404.

---

> [!NOTE]
> On Render's Free tier, Web Services automatically spin down after 15 minutes of inactivity. The first request after idle can take ~30–50 seconds to spin up ("cold start"). This is normal behavior on free hosting.
