# How to Run E-Tongue Project

## Quick Start Guide

### Prerequisites
✅ Node.js 16+ installed (you have v22.14.0)  
✅ npm installed (you have 11.2.0)  
✅ Python 3.8+ installed  
✅ Backend API running on port 8000

---

## Step-by-Step Instructions

### 1. Start Backend API (Terminal 1)

```bash
cd e_tongue/backend
python app.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
Starting E-Tongue API...
ML artifacts loaded successfully!
```

✅ Backend should be running on `http://localhost:8000`

**Verify:** Open browser to `http://localhost:8000/health`

---

### 2. Start Frontend Dashboard (Terminal 2)

```bash
cd e_tongue/frontend
npm install        # First time only
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

✅ Frontend should be running on `http://localhost:3000`

---

### 3. Open Dashboard in Browser

**Navigate to:** `http://localhost:3000`

You should see:
- 🌿 E-Tongue dashboard with sidebar navigation
- Home page with stats and quick actions
- All 6 pages accessible via sidebar

---

## Pages Available

1. **Dashboard** (`/`) - Overview & stats
2. **Identify Dravya** (`/identify`) - Main prediction interface
3. **Dataset Viewer** (`/dataset`) - Data table & CSV tools
4. **Model Training** (`/train`) - Training interface
5. **Sensor Simulation** (`/simulation`) - Signal generator
6. **API Test Console** (`/api-test`) - API testing tool

---

## Troubleshooting

### Port Already in Use

**Frontend (3000):**
- Vite will automatically use the next available port (3001, 3002, etc.)
- Check terminal output for the actual port

**Backend (8000):**
```bash
# Windows: Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Frontend Won't Start

**Clear cache and reinstall:**
```bash
cd e_tongue/frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend Not Connecting

1. **Check backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Verify model files exist:**
   - `e_tongue/ml/model.pkl`
   - `e_tongue/ml/preprocessor.pkl`

3. **Train model if missing:**
   ```bash
   cd e_tongue/ml
   python generate_dataset.py
   python train_model.py
   ```

### API Connection Errors in Frontend

- Check browser console (F12) for errors
- Verify backend URL in browser network tab
- Ensure CORS is enabled in backend (it is)

---

## Production Build (Optional)

### Build Frontend
```bash
cd e_tongue/frontend
npm run build
```

Output will be in `e_tongue/frontend/dist/`

### Serve Production Build
```bash
# Using Python
cd e_tongue/frontend/dist
python -m http.server 8080

# Or using any static server
npx serve dist
```

---

## Development vs Production

### Development (Current Setup)
- Frontend: `npm run dev` → `http://localhost:3000`
- Backend: `python app.py` → `http://localhost:8000`
- Hot reload enabled
- Source maps available

### Production
- Frontend: Built static files in `dist/`
- Backend: Same FastAPI server
- Optimized builds
- No hot reload

---

## File Structure Reference

```
e_tongue/
├── backend/
│   ├── app.py              # FastAPI server
│   └── requirements.txt    # Backend deps
│
├── frontend/
│   ├── src/                # React source code
│   ├── package.json        # Frontend deps
│   └── npm run dev         # Start dev server
│
└── ml/
    ├── model.pkl           # Trained model
    ├── preprocessor.pkl    # Data preprocessor
    └── synthetic_dataset.csv
```

---

## Quick Commands Reference

```bash
# Backend
cd e_tongue/backend && python app.py

# Frontend (first time)
cd e_tongue/frontend && npm install

# Frontend (run)
cd e_tongue/frontend && npm run dev

# Both in one (PowerShell)
Start-Process python -ArgumentList "e_tongue/backend/app.py"
cd e_tongue/frontend; npm run dev
```

---

## Success Indicators

✅ **Backend Running:**
- Terminal shows: "Uvicorn running on http://0.0.0.0:8000"
- `http://localhost:8000/health` returns JSON

✅ **Frontend Running:**
- Terminal shows: "Local: http://localhost:3000/"
- Browser loads dashboard with sidebar

✅ **Everything Working:**
- Dashboard loads
- Identify page shows charts
- API calls succeed
- No console errors

---

**Need Help?** Check the console/terminal for error messages!

