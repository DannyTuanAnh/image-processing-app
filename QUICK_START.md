# 🚀 Quick Deploy Guide (5 minutes)

## ✅ Prerequisites
- GitHub account & repo pushed
- Vercel account (free): [vercel.com](https://vercel.com)
- Render account (free): [render.com](https://render.com)
- Railway account (free): [railway.app](https://railway.app)

---

## **Step 1: Deploy Database (Railway MySQL) - 2 min**

1. Go to [railway.app](https://railway.app)
2. New Project → Add service → **MySQL**
3. Copy the connection string from "Connect" tab
   - Format: `mysql://user:password@host:5432/dbname`

**Save these values:**
```
SPRING_DATASOURCE_URL=jdbc:mysql://[host]:[port]/[dbname]
SPRING_DATASOURCE_USERNAME=[user]
SPRING_DATASOURCE_PASSWORD=[password]
```

---

## **Step 2: Deploy Backend (Render) - 1.5 min**

1. Go to [render.com](https://render.com)
2. New → **Web Service**
3. Connect your GitHub repo
4. Fill in:
   - **Name**: `image-api`
   - **Docker Path**: `backend/upload-picture/Dockerfile`
   - **Plan**: Free
5. Click **Create Web Service**
6. Add Environment Variables:
   - Paste 3 vars from Step 1 above
7. Wait 5 min for build to finish

**Your backend URL:** `https://image-api.onrender.com` ✅

---

## **Step 3: Deploy Frontend (Vercel) - 1 min**

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. **Framework**: Select **Vite**
4. **Root Directory**: `./frontend`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://image-api.onrender.com/upload
   ```
   *(Replace with your actual Render backend URL)*
6. Click **Deploy**

**Your frontend URL:** `https://your-project.vercel.app` ✅

---

## ✅ Done!

| Component | URL |
|-----------|-----|
| **Frontend** | https://your-project.vercel.app |
| **Backend API** | https://image-api.onrender.com/upload |
| **Database** | Railway MySQL |

**Test it:**
1. Open frontend URL
2. Upload an image
3. Check success ✅

---

## 📝 Update Code Later

```bash
git add .
git commit -m "Add new feature"
git push origin main
```
→ Both Vercel & Render auto-redeploy in 5-10 min ✅

---

## 🆘 Troubleshooting

| Problem | Fix |
|---------|-----|
| Upload fails → "Failed to fetch" | Check VITE_API_URL in Vercel includes `/upload` path |
| Backend won't start | Check database credentials in Render env vars |
| CORS error | Already allowed in `CorsConfig.java` for localhost; update if needed |
| Can't find Render backend URL | Go to Render service → Settings → copy Deploy URL |
