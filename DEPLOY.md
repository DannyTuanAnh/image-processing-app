# Cloud Deployment Guide

Deploy fullstack: **Frontend → Vercel** | **Backend → Render** | **DB → Railway/Neon**

---

## 🔷 **Frontend: Vercel Deployment**

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Init fullstack app"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → Import GitHub repo
2. **Framework**: Vite
3. **Root Directory**: `./frontend`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. Click **Deploy** → Vercel builds automatically

### Step 3: Set Backend API URL
After Render backend is deployed (see below):
1. Go to **Settings → Environment Variables**
2. Add: `VITE_API_URL` = `https://<render-backend-url>/upload`
   - Example: `https://image-api.onrender.com/upload`
3. Redeploy: **Deployments → Redeploy**

✅ **Frontend will be live at**: `https://<your-vercel-domain>.vercel.app`

---

## 🟦 **Backend: Render Deployment**

### Option A: Automatic (render.yaml)
1. Go to [render.com](https://render.com) → New → **Blueprint**
2. Connect GitHub repo
3. Click **Deploy** → Render auto-builds from `render.yaml`
4. Database created automatically ✅

### Option B: Manual Setup
1. Go to [render.com](https://render.com) → New **Web Service**
2. **Name**: `image-api`
3. **GitHub Repo**: Connect your repo
4. **Runtime**: Docker
5. **Dockerfile Path**: `backend/upload-picture/Dockerfile`
6. **Plan**: Free / Starter
7. Click **Create Web Service**

### Step 4: Link Database (Railway/Neon)
After creating backend service on Render:

**Using Railway MySQL:**
1. Go to [railway.app](https://railway.app) → New Project
2. Add service → **MySQL**
3. Copy connection string from Railway
4. In Render backend → **Environment** → Add:
   ```
   SPRING_DATASOURCE_URL = jdbc:mysql://[host]:[port]/[database]
   SPRING_DATASOURCE_USERNAME = [user]
   SPRING_DATASOURCE_PASSWORD = [password]
   ```

**Using Neon PostgreSQL:** (Cost-efficient)
1. Go to [neon.tech](https://neon.tech) → Create project
2. Copy connection string
3. Render backend → **Environment** → Add:
   ```
   SPRING_DATASOURCE_URL = jdbc:postgresql://[host]:[port]/[database]
   SPRING_DATASOURCE_USERNAME = [user]
   SPRING_DATASOURCE_PASSWORD = [password]
   ```

✅ **Backend will be live at**: `https://image-api.onrender.com`

---

## 🟢 **Database Options**

### **Railway MySQL** (Recommended for this app)
- Free tier: $5 credit/month
- Easy dashboard
- Good MySQL support
- [railway.app](https://railway.app)

### **Neon PostgreSQL** (Cost-optimized)
- Free tier: Generous limits
- Serverless PostgreSQL
- Auto-sleep on inactivity → lower cost
- [neon.tech](https://neon.tech)

### **Render PostgreSQL** (Built-in)
- Use `render.yaml` above
- Free tier: limited
- Simple setup

---

## 📋 **Environment Variables Summary**

**Frontend (Vercel):**
```
VITE_API_URL = https://image-api.onrender.com/upload
```

**Backend (Render):**
```
SPRING_DATASOURCE_URL = jdbc:mysql://[railway-host]:3306/[db-name]
SPRING_DATASOURCE_USERNAME = [user]
SPRING_DATASOURCE_PASSWORD = [password]
```

---

## 🔗 **Final Architecture**

```
┌─────────────────┐
│   Vercel        │ ← User visits https://app.vercel.app
│  (Frontend)     │
└────────┬────────┘
         │ API calls to
         ↓
┌──────────────────────┐
│   Render (Docker)    │ ← Backend at https://image-api.onrender.com
│   (Spring Boot)      │
└────────┬─────────────┘
         │ queries
         ↓
┌──────────────────────┐
│  Railway/Neon MySQL  │
│  (Managed DB)        │
└──────────────────────┘
```

---

## ✅ **Verification Steps**

1. **Frontend loads**: Open `https://app.vercel.app` → see UI ✅
2. **API works**: Upload image → check browser Network tab → 200 OK ✅
3. **DB works**: Upload success → check Railway/Neon → file record exists ✅

---

## 🔧 **Troubleshooting**

| Issue | Solution |
|-------|----------|
| **CORS error on frontend** | Backend `CorsConfig.java` allows frontend URL? Update if needed |
| **Backend won't start** | Check Render logs: `docker-compose logs backend` equivalent |
| **DB connection fails** | Verify SPRING_DATASOURCE_URL in Render env vars matches Railway/Neon |
| **Frontend shows "Failed to fetch"** | Check VITE_API_URL in Vercel is correct (with `/upload` path) |

---

## 🚀 **Updates Later**

**To update code:**
```bash
git add .
git commit -m "Fix: update feature"
git push origin main
```
✅ Vercel & Render auto-redeploy within 5-10 minutes!
