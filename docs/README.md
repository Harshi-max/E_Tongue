# E-Tongue for Dravya Identification

A complete production-ready Machine Learning system for identifying Ayurvedic Dravya (herbs) using simulated Electronic Tongue sensor data.

## 🌿 Project Overview

This project implements an **E-Tongue (Electronic Tongue)** system for automated identification of Ayurvedic herbs without requiring physical hardware. The system uses machine learning to classify dravya based on simulated sensor readings including pH, conductivity, temperature, and voltammetry signals.

### Why Electronic Tongue?

The Electronic Tongue is a biomimetic device that mimics human taste perception. In this project, we simulate:
- **pH Sensor**: Measures acidity/alkalinity
- **Conductivity Sensor**: Measures electrical conductivity
- **Temperature Sensor**: Measures solution temperature
- **Voltammetry Sensor**: Simulates electrochemical response (time-series signal)

### Why ML Replaces Physical Hardware?

Instead of expensive physical sensors, we:
1. **Generate synthetic datasets** that mimic real sensor behavior
2. **Train ML models** on these simulated patterns
3. **Deploy as API** for real-time predictions
4. **Enable future hardware integration** when sensors are available

## 📁 Project Structure

```
e_tongue/
├── ml/                          # Machine Learning Pipeline
│   ├── generate_dataset.py      # Synthetic dataset generation
│   ├── preprocess.py            # Data preprocessing utilities
│   ├── train_model.py           # ML model training
│   ├── utils.py                 # Helper functions
│   ├── model.pkl                # Trained model (generated)
│   ├── preprocessor.pkl         # Preprocessor (generated)
│   └── synthetic_dataset.csv    # Dataset (generated)
│
├── backend/                     # FastAPI Backend
│   ├── app.py                   # API server
│   └── requirements.txt         # Python dependencies
│
├── frontend/                    # Web Frontend
│   └── index.html              # Interactive dashboard
│
└── docs/                        # Documentation
    ├── README.md               # This file
    ├── architecture.md         # System architecture
    └── API_docs.md             # API documentation
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Installation

1. **Clone/Navigate to project directory**
   ```bash
   cd e_tongue
   ```

2. **Install ML dependencies**
   ```bash
   cd ml
   pip install -r ../backend/requirements.txt
   pip install matplotlib seaborn scikit-learn pandas numpy
   # Optional: For CNN model
   pip install tensorflow
   ```

3. **Generate synthetic dataset**
   ```bash
   python generate_dataset.py
   ```
   This creates `synthetic_dataset.csv` with ~1505 samples across 7 dravya classes.

4. **Train ML models**
   ```bash
   python train_model.py
   ```
   This will:
   - Train Random Forest, SVM, and optionally CNN models
   - Compare their performance
   - Save the best model as `model.pkl`
   - Generate evaluation reports and confusion matrix

5. **Start backend API**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   python app.py
   ```
   API will be available at `http://localhost:8000`

6. **Open frontend**
   - Open `frontend/index.html` in a web browser
   - Or use a local server:
     ```bash
     cd ../frontend
     python -m http.server 8080
     ```
     Then visit `http://localhost:8080`

## 📊 Dataset Explanation

### Synthetic Data Generation

The dataset simulates sensor readings for 7 Ayurvedic Dravya:

1. **Neem** - Slightly acidic, moderate conductivity
2. **Turmeric** - Near neutral pH, higher conductivity
3. **Tulsi** - Neutral pH, moderate conductivity
4. **Ginger** - Acidic, high conductivity
5. **Amla** - Highly acidic (characteristic), very high conductivity
6. **Ashwagandha** - Slightly basic, moderate conductivity
7. **Brahmi** - Neutral to slightly basic, lower conductivity

### Sensor Characteristics

- **pH**: Range 3.5-7.8 (simulating different acidity levels)
- **Conductivity**: 0.7-2.8 S/m (electrical properties)
- **Temperature**: 24-32°C (ambient to slightly elevated)
- **Voltammetry**: 100-point time-series signal with:
  - Gaussian-like peaks (simulating redox processes)
  - Harmonic components
  - Realistic noise

### Dataset Statistics

- **Total samples**: ~1505 (215 per class)
- **Features**: 11 (3 basic + 8 voltammetry statistics)
- **Classes**: 7 Ayurvedic herbs
- **Train/Val/Test split**: 70%/15%/15%

## 🤖 Machine Learning Models

### Model Pipeline

1. **Random Forest Classifier**
   - Ensemble method with hyperparameter tuning
   - Fast training and inference
   - Good baseline performance

2. **Support Vector Machine (SVM)**
   - Kernel-based classifier
   - Excellent for non-linear patterns
   - Grid search optimization

3. **1D Convolutional Neural Network (CNN)** [Optional]
   - Deep learning for time-series voltammetry
   - Requires TensorFlow
   - Best for complex signal patterns

### Feature Extraction

From each sample, we extract:
- **Basic features** (3): pH, conductivity, temperature
- **Voltammetry statistics** (8):
  - Mean, Std, Max, Min, Median
  - Q1, Q3 (quartiles)
  - Total variation

Total: **11 features** per sample

## 🔌 API Endpoints

### `GET /health`
Check API and model status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_name": "random_forest"
}
```

### `POST /predict`
Predict dravya from sensor data.

**Request:**
```json
{
  "ph": 7.0,
  "conductivity": 1.5,
  "temperature": 25.0,
  "voltammetry": [0.3, 0.32, 0.35, ...]
}
```

**Response:**
```json
{
  "predicted_dravya": "Turmeric",
  "confidence": 0.95,
  "all_probabilities": {
    "Turmeric": 0.95,
    "Ginger": 0.03,
    ...
  },
  "model_name": "random_forest"
}
```

See `docs/API_docs.md` for detailed API documentation.

## 🖥️ Frontend Interface

The web interface provides:
- **Sensor input forms** for all parameters
- **Auto-generation** of voltammetry signals
- **Real-time API connection** checking
- **Visual results** with confidence bars
- **Probability distribution** across all classes

## 📈 Evaluation Metrics

After training, the system generates:
- **Accuracy score**
- **Precision, Recall, F1-score**
- **Classification report** (per-class metrics)
- **Confusion matrix** (visualization)

All saved as:
- `evaluation_report.json` (JSON format)
- `evaluation_report.txt` (human-readable)
- `confusion_matrix.png` (visual)

## 🔮 Future Scope

### Adding Real Sensors

When physical hardware becomes available:

1. **Hardware Integration**
   - Replace `generate_dataset.py` with sensor reading module
   - Connect to Arduino/Raspberry Pi with sensors
   - Implement real-time data acquisition

2. **Model Retraining**
   - Collect real sensor data
   - Fine-tune existing models or retrain from scratch
   - Compare synthetic vs. real data performance

3. **Sensor Calibration**
   - Calibrate synthetic patterns to match real sensors
   - Adjust feature extraction for actual signal characteristics

4. **Deployment**
   - Deploy on edge devices (Jetson Nano, etc.)
   - Integrate with IoT platforms
   - Real-time streaming predictions

### Potential Enhancements

- [ ] Multi-sensor fusion (add more sensor types)
- [ ] Deep learning architectures (LSTM, Transformer)
- [ ] Uncertainty quantification
- [ ] Active learning for dataset improvement
- [ ] Mobile app (React Native)
- [ ] Database integration for historical data
- [ ] User authentication and session management
- [ ] Batch prediction API
- [ ] Model versioning and A/B testing

## 🛠️ Troubleshooting

### Model Not Loading
- Ensure you've run `train_model.py` first
- Check that `model.pkl` and `preprocessor.pkl` exist in `ml/` directory

### Import Errors
- Install all requirements: `pip install -r backend/requirements.txt`
- For CNN: `pip install tensorflow`

### API Connection Issues
- Verify backend is running: `python backend/app.py`
- Check port 8000 is available
- Update frontend API URL if using different port

### Dataset Generation Issues
- Ensure numpy and pandas are installed
- Check sufficient disk space (~10MB for dataset)

## 📝 License

This project is provided as-is for educational and research purposes.

## 👥 Contributing

Contributions welcome! Areas for improvement:
- Additional dravya classes
- Better synthetic data generation
- Model architecture improvements
- Frontend enhancements
- Documentation improvements

## 📧 Contact

For questions or issues, please open an issue in the repository.

---

**Built with ❤️ for Ayurvedic Medicine and Machine Learning**

