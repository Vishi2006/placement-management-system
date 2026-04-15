# Render Deployment Fix Guide

## Problem
The initial Render deployment failed with:
```
Error: Cannot find module '/opt/render/project/src/backend/backend/server.js'
```

This happened because Render wasn't correctly configured for the monorepo structure.

## Solution Applied

### 1. **Created `render.yaml` Configuration**
Added a `render.yaml` file at the project root that properly configures:
- Service type: web service
- Root directory: `backend` (tells Render to use backend folder as root)
- Build command: `npm install`
- Start command: `node server.js`
- Environment variables configuration

### 2. **Updated Backend `package.json`**
Added `"start": "node server.js"` script to backend/package.json for explicit start command.

### 3. **Updated GitHub Repository**
Pushed the configuration files to GitHub:
```bash
git add render.yaml backend/package.json
git commit -m "Fix: Add render.yaml configuration for proper Render deployment"
git push origin main
```

## How to Re-Deploy on Render

### Step 1: Clear Previous Deployment
1. Go to https://dashboard.render.com
2. Select your `pms-backend` service
3. Go to **Settings** → **Danger Zone** → **Delete Web Service** (if needed)
4. Or manually trigger a re-deploy

### Step 2: Redeploy with New Configuration
**Option A: Manual Redeploy**
1. Go to Render Dashboard → `pms-backend`
2. Click **Manual Deploy** → **Deploy latest commit**
3. Wait for deployment to complete
4. Check logs in **Logs** tab

**Option B: Auto-Deploy (Recommended)**
1. Render automatically detects git push
2. New commit (0a27a1a) will trigger automatic deployment
3. Watch the deployment progress in Logs

### Step 3: Verify Deployment
Once deployment completes:
1. Go to **pms-backend** service page
2. Copy the service URL (e.g., `https://pms-backend-xxxxx.onrender.com`)
3. Test the API:
   ```bash
   curl https://pms-backend-xxxxx.onrender.com/
   # Should return: "Server is live!"
   ```

### Step 4: Update Frontend
Update your Vercel frontend with the new backend URL:
1. Go to Vercel Dashboard → Your project
2. Go to **Settings** → **Environment Variables**
3. Update `VITE_API_URL` to your new Render backend URL:
   ```
   VITE_API_URL=https://pms-backend-xxxxx.onrender.com/api
   ```
4. Redeploy: **Deployments** → **Redeploy**

### Step 5: Update Backend FRONTEND_URL (if needed)
If running frontend on custom domain:
1. Go to Render Dashboard → `pms-backend`
2. Go to **Environment** → Update `FRONTEND_URL`
3. Render automatically redeploys

## Environment Variables to Set on Render

Make sure these are all set in Render Dashboard under **Environment**:

```
PORT=5000
NODE_ENV=production
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=your_vercel_frontend_url
```

## Troubleshooting

### If deployment still fails:
1. **Check Logs:**
   - Go to Render Dashboard → Service → **Logs** tab
   - Look for error messages
   - Copy full error for debugging

2. **Common Issues:**
   - **MongoDB Connection Error**: Verify MONGO_URL is correct and accessible
   - **Missing Env Variables**: Check all 9 environment variables are set
   - **Port Issue**: Render assigns dynamic port, but our config uses PORT env var

3. **Re-Deploy Steps:**
   ```bash
   # Pull latest changes
   git pull origin main
   
   # Verify files are present
   ls -la render.yaml
   ls -la backend/package.json
   
   # If files missing, re-create them from this guide
   ```

### If you see "Module not found" errors:
1. Check `render.yaml` is at project root (not in backend)
2. Check `rootDir: backend` is correctly set in render.yaml
3. Check `startCommand: node server.js` matches backend/package.json `"start"` script
4. Try deleting service and creating new one with render.yaml

## API Testing

Once deployed successfully, test these endpoints:

```bash
# Server status
curl https://pms-backend-xxxxx.onrender.com/
# Response: "Server is live!"

# Admin login (default credentials)
curl -X POST https://pms-backend-xxxxx.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pms.com","password":"AdminPMS@123"}'
```

## Success Indicators ✅

Deployment is successful when:
- ✅ Render shows "Live" status (green)
- ✅ Logs show "🚀 Server running on port 5000"
- ✅ `/` endpoint returns "Server is live!"
- ✅ `/api/auth/login` accepts requests
- ✅ MongoDB connection messages appear in logs

## Next Steps

After successful backend deployment:
1. Deploy frontend to Vercel with correct VITE_API_URL
2. Test login functionality end-to-end
3. Test job applications, interviews, etc.
4. Monitor logs for any errors

Need help? Check Render documentation: https://render.com/docs
