# Render Deployment Guide for E-Tongue

## Option 1: Use PostgreSQL on Render (Recommended)

### Setup PostgreSQL Database

1. Go to [render.com](https://render.com)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name:** `e-tongue-db`
   - **Database:** `etongue`
   - **User:** `etongue_user`
   - **Region:** Same as your Web Service
   - **PostgreSQL Version:** 15
4. Click **Create Database**
5. Copy the **Internal Database URL** (keep this secret)

### Update Backend for PostgreSQL

The backend currently uses SQLite (`users.db`). To deploy on Render with a persistent database, we need to:

1. Install PostgreSQL driver:
   ```bash
   pip install psycopg2-binary sqlalchemy
   ```

2. Update `requirements.txt` to add PostgreSQL support

3. Modify backend to accept database URL from environment variable

### For Now: Quick Fix (SQLite Approach)

If you want to keep SQLite simple:

1. **Store database in `/tmp` (NOT recommended - data lost on restart):**
   - Set `DB_FILE = os.getenv("DB_PATH", "/tmp/users.db")`
   - Add environment variable in Render: `DB_PATH=/tmp/users.db`

2. **Better: Use Render Disk (if available):**
   - Add persistent volume to Render Web Service
   - Store database there

---

## Option 2: Keep Current Setup (SQLite Local)

### Best Practice for Development/Testing:

1. **Keep backend running locally**
   ```bash
   cd e_tongue
   python backend/app.py
   ```
   Backend will be at: `http://localhost:8000`

2. **Deploy frontend only to Netlify**
   - Update `frontend/.env` to point to your public backend URL or localhost tunnel
   - Use Netlify for frontend hosting

3. **Use Ngrok to expose local backend publicly** (for testing):
   ```bash
   ngrok http 8000
   ```
   This gives you a public URL like `https://xxx.ngrok.io` to use in frontend

---

## Option 3: Recommended Production Setup

### Deploy Full Stack Properly:

**Backend on Render + PostgreSQL:**
1. Add PostgreSQL to `requirements.txt`
2. Update backend to use environment variable for database URL
3. Deploy backend on Render with PostgreSQL
4. Update frontend `.env` to point to Render backend URL
5. Deploy frontend on Netlify

**Frontend on Netlify:**
1. Update `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
2. Build command: `cd frontend && npm install && npm run build`
3. Publish directory: `frontend/dist`

---

## Quick Deployment Checklist

### For Local Development (Current Setup):
- ✅ Backend running on `http://localhost:8000`
- ✅ Frontend running on `http://localhost:3000`
- ✅ Database: `users.db` stored locally
- ✅ Works perfectly for development

### For Production (Recommended):

**Backend:**
- [ ] Add PostgreSQL to requirements
- [ ] Update auth.py to support database URL from env var
- [ ] Deploy to Render with PostgreSQL
- [ ] Set environment variables on Render

**Frontend:**
- [ ] Update `.env.production` with backend URL
- [ ] Deploy to Netlify
- [ ] Test full flow

---

## Environment Variables to Set on Render

```
JWT_SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@host:5432/database
PYTHONUNBUFFERED=1
```

---

## For Now: Keep Working Locally

Since you have everything working locally, keep using:
- **Backend:** `http://localhost:8000` (running on your machine)
- **Frontend:** `http://localhost:3000` (Vite dev server)
- **Database:** `users.db` (local SQLite)

This is perfect for development and testing!

To expose the backend publicly for Netlify frontend testing:
```bash
ngrok http 8000
# Use the ngrok URL in frontend/.env
```

