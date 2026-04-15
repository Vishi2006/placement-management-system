# Render Deployment - Final Fix Instructions

## Issue Resolution

The `render.yaml` file wasn't being detected by Render. I've created a simpler solution using a root-level server wrapper.

### What Changed

1. **Created `server.js` at root** - This file acts as a wrapper that starts the backend server
2. **Updated root `package.json`** - Changed start command from `node backend/server.js` to `node server.js`
3. **Updated `render.yaml`** - Simplified to use standard commands without rootDir

## How to Deploy Now

### Step 1: Delete Existing Render Service (IMPORTANT!)

Go to https://dashboard.render.com

1. Click on `pms-backend` service
2. Go to **Settings** at the bottom
3. Scroll to **Danger Zone**
4. Click **Delete Web Service**
5. Type the service name to confirm
6. Delete it

### Step 2: Create New Web Service

1. Click **+ New** → **Web Service**
2. Select your GitHub repository (should show `placement-management-system`)
3. Fill in these details:
   - **Name**: `pms-backend`
   - **Environment**: Node
   - **Branch**: main (default)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or Premium)

4. Click **Advanced** and add Environment Variables:

```
PORT = 5000
NODE_ENV = production
MONGO_URL = <your-mongodb-connection-string>
JWT_SECRET = <your-secret-key>
JWT_EXPIRE = 7d
CLOUDINARY_CLOUD_NAME = <your-cloudinary-name>
CLOUDINARY_API_KEY = <your-api-key>
CLOUDINARY_API_SECRET = <your-api-secret>
FRONTEND_URL = <your-vercel-frontend-url>
```

5. Click **Create Web Service**

### Step 3: Monitor Deployment

1. Watch the **Logs** tab
2. Look for messages like:
   ```
   npm install
   npm start
   ✅ Admin user initialized
   🚀 Server running on port 5000
   ```
3. Once you see "🚀 Server running", deployment is successful!

### Step 4: Get Your Backend URL

1. Copy the service URL from the top of the page
   - Format: `https://pms-backend-xxxxx.onrender.com`
2. Test it: Visit `https://pms-backend-xxxxx.onrender.com/`
   - Should show: `Server is live!`

### Step 5: Update Vercel Frontend

1. Go to https://vercel.com/dashboard
2. Select your PMS project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://pms-backend-xxxxx.onrender.com/api
   ```
5. Click **Deployments** → **Redeploy latest**

### Step 6: Update Render Backend (if using custom domain)

If you set up a custom domain on Vercel:
1. Go to Render Dashboard → `pms-backend` → **Environment**
2. Update `FRONTEND_URL` to your Vercel custom domain
3. Render auto-redeploys

## File Structure After Fix

```
placement-management-system/
├── server.js          (NEW - Root wrapper)
├── package.json       (UPDATED - Uses npm start)
├── render.yaml        (UPDATED - Simplified)
├── backend/
│   ├── server.js      (Original backend entry)
│   ├── package.json
│   └── ...
├── frontend/
│   ├── package.json
│   └── ...
```

## How It Works

1. **Render runs**: `npm start`
2. **package.json** executes: `node server.js`
3. **Root server.js** loads: `require('./backend/server.js')`
4. **Backend server.js** starts the Express app on port 5000

## Troubleshooting

### Still getting "Cannot find module" error?

1. **Service wasn't deleted**: Delete it and create a new one
2. **Old configuration cached**: Hard refresh Render dashboard (Ctrl+Shift+R)
3. **Build failed silently**: Check the Logs tab for npm errors

### If you see "npm: not found":

The instance was created incorrectly. Delete and recreate, making sure:
- Runtime is set to "Node"
- Build Command is `npm install`
- Start Command is `npm start`

### MongoDB connection fails:

1. Verify MONGO_URL is correct in environment variables
2. Add Render IP to MongoDB whitelist (use 0.0.0.0/0 for testing)
3. Check if MongoDB cluster is active

## Testing API

```bash
# Test 1: Basic connectivity
curl https://pms-backend-xxxxx.onrender.com/
# Expected: "Server is live!"

# Test 2: Login (after adding keys to Render)
curl -X POST https://pms-backend-xxxxx.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pms.com","password":"AdminPMS@123"}'
# Should return token if successful
```

## Success Checklist ✅

- [ ] Deleted old Render service
- [ ] Created new Web Service
- [ ] Set all 9 environment variables
- [ ] Service shows "Live" status (green)
- [ ] Logs show "Server running on port 5000"
- [ ] Root endpoint returns "Server is live!"
- [ ] Updated Vercel with new backend URL
- [ ] Frontend loads without CORS errors

## Latest Changes

Commit: `72e04b5`
- Added root-level `server.js` wrapper
- Updated `package.json` start command
- Simplified `render.yaml`

Everything is pushed to GitHub and ready to deploy!
