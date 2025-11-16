# Quick Start Guide - E-Tongue Project

## 🚀 Current Status

### Backend API
- **Status:** Running on `http://localhost:8000`
- **Endpoints:**
  - `GET /health` - Health check
  - `GET /api/status` - System status
  - `POST /api/login` - User authentication
  - `POST /predict` - Dravya prediction

### Frontend Dashboard
- **Status:** Running on `http://localhost:3000`
- **Features:**
  - Login page at `/login`
  - Protected dashboard routes
  - 6 main pages with authentication

## 📋 How to Access

### 1. Open Dashboard
```
http://localhost:3000
```

**Note:** You'll be redirected to `/login` if not authenticated.

### 2. Login
- **Email:** Any email (e.g., `user@example.com`)
- **Password:** Any password (e.g., `password123`)
- Click "Login" button

### 3. Access Dashboard
After login, you'll have access to:
- **Dashboard Home** (`/`) - Overview and stats
- **Identify Dravya** (`/identify`) - Prediction interface
- **Dataset Viewer** (`/dataset`) - Data table
- **Model Training** (`/train`) - Training interface
- **Sensor Simulation** (`/simulation`) - Signal generator
- **API Test Console** (`/api-test`) - API testing

## 🔄 Restart Instructions

### If Backend Needs Restart:
```bash
# Stop current backend (Ctrl+C)
cd e_tongue/backend
python app.py
```

### If Frontend Needs Restart:
```bash
# Stop current frontend (Ctrl+C)
cd e_tongue/frontend
npm run dev
```

## ✅ Verification

### Test Backend:
```bash
# Health check
curl http://localhost:8000/health

# Login endpoint
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

### Test Frontend:
1. Open `http://localhost:3000`
2. Should redirect to `/login`
3. Enter credentials and login
4. Should see dashboard

## 🎨 Features

### Sidebar
- Lighter blue background (blue-500/600)
- White text with yellow hover
- Active items highlighted in blue-300
- Logout button at bottom

### Authentication
- Login page with email/password
- JWT token stored in localStorage
- Protected routes
- Auto-redirect to login if not authenticated

### Pages
- All 6 pages fully functional
- Charts and visualizations
- API integration
- Real-time updates

## 🐛 Troubleshooting

### Backend Not Starting
- Check if port 8000 is available
- Verify model files exist: `ml/model.pkl`, `ml/preprocessor.pkl`
- Check Python dependencies

### Frontend Not Starting
- Check if port 3000 is available
- Run `npm install` if needed
- Check Node.js version (16+)

### Login Not Working
- Verify backend is running
- Check browser console for errors
- Ensure `/api/login` endpoint is accessible

### Token Issues
- Clear localStorage: `localStorage.clear()`
- Try logging in again
- Check browser console

---

**Everything should be running! Open http://localhost:3000 to get started.** 🎉

