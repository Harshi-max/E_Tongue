# Setup Instructions

Complete step-by-step guide to set up and run the E-Tongue Dravya Identification system.

## Prerequisites

- **Python 3.8 or higher**
- **pip** (Python package installer)
- **Web browser** (for frontend)
- **Terminal/Command Prompt**

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd e_tongue
```

### Step 2: Create Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

**Optional:** If you want to use the CNN model:
```bash
pip install tensorflow
```

### Step 4: Generate Synthetic Dataset

```bash
cd ml
python generate_dataset.py
```

This will create:
- `synthetic_dataset.csv` (~1505 samples)
- Output statistics in terminal

### Step 5: Train ML Models

```bash
python train_model.py
```

This will:
- Train Random Forest, SVM, and optionally CNN models
- Compare performance
- Save best model as `model.pkl`
- Generate evaluation reports
- Create confusion matrix visualization

**Note:** Training may take several minutes depending on your system.

**Output files:**
- `model.pkl` - Best trained model
- `preprocessor.pkl` - Fitted preprocessor
- `model_metadata.json` - Model information
- `evaluation_report.json` - Performance metrics (JSON)
- `evaluation_report.txt` - Performance metrics (text)
- `confusion_matrix.png` - Confusion matrix visualization

### Step 6: Start Backend API

```bash
cd ../backend
python app.py
```

The API will start at: `http://localhost:8000`

You should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test the API:**
- Open browser: `http://localhost:8000/docs`
- Or check health: `http://localhost:8000/health`

### Step 7: Open Frontend

**Option 1: Direct File Access**
- Open `frontend/index.html` in your web browser
- Update API URL if needed (default: `http://localhost:8000`)

**Option 2: Local Server (Recommended)**
```bash
cd ../frontend
python -m http.server 8080
```

Then open: `http://localhost:8080`

## Quick Test

### 1. Test API Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_name": "random_forest"
}
```

### 2. Test Prediction

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "ph": 7.0,
    "conductivity": 1.5,
    "temperature": 25.0,
    "voltammetry": [0.3, 0.32, 0.35, 0.38, 0.40, 0.42, 0.45, 0.48, 0.50, 0.52]
  }'
```

Expected response:
```json
{
  "predicted_dravya": "Turmeric",
  "confidence": 0.95,
  "all_probabilities": {...},
  "model_name": "random_forest"
}
```

### 3. Test Frontend

1. Open frontend in browser
2. Check connection (should show "✓ Connected")
3. Enter sensor values
4. Click "Identify Dravya"
5. View prediction with confidence

## Troubleshooting

### Issue: Model Not Loading

**Error:** `Model not loaded. Please train the model first.`

**Solution:**
1. Ensure you've run `python ml/train_model.py`
2. Check that `ml/model.pkl` and `ml/preprocessor.pkl` exist
3. Verify file paths in `backend/app.py`

### Issue: Import Errors

**Error:** `ModuleNotFoundError`

**Solution:**
```bash
pip install -r requirements.txt
```

For CNN:
```bash
pip install tensorflow
```

### Issue: Port Already in Use

**Error:** `Address already in use`

**Solution:**
- Change port in `backend/app.py`: `uvicorn.run(app, host="0.0.0.0", port=8001)`
- Or kill process using port 8000

**Windows:**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:8000 | xargs kill
```

### Issue: Dataset Not Found

**Error:** `FileNotFoundError: synthetic_dataset.csv`

**Solution:**
```bash
cd ml
python generate_dataset.py
```

### Issue: CORS Errors in Frontend

**Error:** `CORS policy: No 'Access-Control-Allow-Origin'`

**Solution:**
- Ensure backend is running
- Check API URL in frontend matches backend
- Verify CORS middleware in `backend/app.py`

### Issue: TensorFlow Installation

**Error:** TensorFlow installation issues

**Solution:**
```bash
# CPU version
pip install tensorflow

# GPU version (if you have CUDA)
pip install tensorflow-gpu

# Verify installation
python -c "import tensorflow as tf; print(tf.__version__)"
```

### Issue: Slow Training

**Solution:**
- Training takes time for grid search
- Consider reducing parameter grid in `train_model.py`
- Or train individual models separately

## Verification Checklist

- [ ] Python 3.8+ installed
- [ ] Virtual environment created and activated
- [ ] All dependencies installed
- [ ] Dataset generated successfully
- [ ] Models trained and saved
- [ ] Backend API running on port 8000
- [ ] Frontend accessible in browser
- [ ] Health check returns "healthy"
- [ ] Prediction endpoint works
- [ ] Frontend can connect to API

## Next Steps

After setup:
1. **Explore the dataset**: Check `ml/synthetic_dataset.csv`
2. **Review evaluation**: See `ml/evaluation_report.txt`
3. **Check confusion matrix**: Open `ml/confusion_matrix.png`
4. **Test different inputs**: Try various sensor values
5. **Read documentation**: Check `docs/` directory

## Production Deployment

For production:
1. Use proper authentication
2. Set up HTTPS
3. Use production WSGI server (Gunicorn)
4. Implement logging
5. Add monitoring
6. Set up database for predictions
7. Use environment variables for config
8. Containerize with Docker

See `docs/architecture.md` for more details.

---

**Need Help?** Check `docs/README.md` for more information.

