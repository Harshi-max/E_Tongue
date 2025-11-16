# System Architecture

## Overview

The E-Tongue Dravya Identification system is built as a modular, production-ready ML application with clear separation between data generation, model training, API serving, and user interface.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                  (HTML/JavaScript)                           │
│  - User input forms                                          │
│  - API integration                                           │
│  - Result visualization                                      │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
                     │
┌────────────────────▼────────────────────────────────────────┐
│                      BACKEND API                             │
│                    (FastAPI/Python)                          │
│  - /predict endpoint                                         │
│  - /health endpoint                                          │
│  - Request validation                                        │
│  - Feature extraction                                        │
│  - Model inference                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Model loading
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    ML PIPELINE                               │
│                                                              │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │ Data Generation  │──────▶│ Preprocessing    │            │
│  │ (Synthetic)      │       │ (Feature Extract)│            │
│  └──────────────────┘       └────────┬─────────┘            │
│                                      │                       │
│                                      ▼                       │
│                            ┌──────────────────┐             │
│                            │ Model Training   │             │
│                            │ - Random Forest  │             │
│                            │ - SVM            │             │
│                            │ - CNN (optional) │             │
│                            └────────┬─────────┘             │
│                                      │                       │
│                                      ▼                       │
│                            ┌──────────────────┐             │
│                            │ Model Selection  │             │
│                            │ (Best Model)     │             │
│                            └──────────────────┘             │
│                                      │                       │
│                                      ▼                       │
│                            ┌──────────────────┐             │
│                            │ Serialization    │             │
│                            │ model.pkl        │             │
│                            │ preprocessor.pkl │             │
│                            └──────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Data Generation Layer (`ml/generate_dataset.py`)

**Purpose**: Generate synthetic sensor data without hardware

**Key Functions**:
- `generate_voltammetry_signal()`: Creates time-series electrochemical signal
- `generate_sample()`: Creates single sample with all sensor readings
- `generate_dataset()`: Batch generation with class distribution

**Output**: `synthetic_dataset.csv`
- ~1505 samples
- 7 dravya classes
- Columns: dravya, ph, conductivity, temperature, voltammetry

**Design Decisions**:
- Gaussian distributions for realistic variation
- Class-specific parameter ranges
- Noise injection for realism
- Reproducibility via random seed

### 2. Preprocessing Layer (`ml/preprocess.py`)

**Purpose**: Feature extraction and data normalization

**Key Components**:
- `DataPreprocessor` class:
  - Feature extraction from raw sensor data
  - StandardScaler for normalization
  - LabelEncoder for class encoding
  - Save/load functionality

**Feature Extraction**:
- Basic: pH, conductivity, temperature (3 features)
- Voltammetry statistics:
  - Mean, Std, Max, Min, Median
  - Q1, Q3 (quartiles)
  - Total variation
- Total: 11 features

**Why This Design**:
- Statistical features reduce dimensionality from 100 (voltammetry points) to 8
- Retains signal characteristics while being computationally efficient
- Compatible with traditional ML models (RF, SVM)

### 3. Model Training Layer (`ml/train_model.py`)

**Purpose**: Train and compare multiple ML models

**Models Implemented**:

1. **Random Forest**
   - Hyperparameter grid search
   - Fast training, interpretable
   - Good baseline

2. **SVM**
   - RBF and polynomial kernels
   - Good for non-linear patterns
   - Probability estimates enabled

3. **CNN** (Optional)
   - 1D convolutions for time-series
   - Uses raw voltammetry signal
   - Requires TensorFlow

**Training Process**:
1. Load and preprocess data
2. Train/Val/Test split (70/15/15)
3. Grid search hyperparameters for each model
4. Evaluate on validation set
5. Select best model
6. Final evaluation on test set
7. Save artifacts (model, preprocessor, reports)

**Output Artifacts**:
- `model.pkl`: Best trained model
- `preprocessor.pkl`: Fitted preprocessor
- `model_metadata.json`: Model info and scores
- `evaluation_report.json/txt`: Performance metrics
- `confusion_matrix.png`: Visualization

### 4. Backend API Layer (`backend/app.py`)

**Purpose**: RESTful API for model inference

**Framework**: FastAPI
- Automatic API documentation
- Request validation via Pydantic
- CORS support for frontend
- Async capability

**Endpoints**:

1. **GET /health**
   - Health check
   - Model status verification
   - Returns model info

2. **POST /predict**
   - Accepts sensor data JSON
   - Validates input (Pydantic models)
   - Extracts features
   - Runs model inference
   - Returns predictions with confidence

**Request Flow**:
```
User Request → Pydantic Validation → Feature Extraction → 
Preprocessing → Model Inference → Response Formatting → 
JSON Response
```

**Error Handling**:
- Model not loaded → 503 Service Unavailable
- Invalid input → 400 Bad Request
- Prediction errors → 400 with error details

**Model Loading**:
- Loaded at startup (`@app.on_event("startup")`)
- Global variables for model and preprocessor
- Supports both scikit-learn and TensorFlow models

### 5. Frontend Layer (`frontend/index.html`)

**Purpose**: User-friendly web interface

**Technology**: Vanilla HTML/CSS/JavaScript
- No framework dependencies
- Responsive design
- Modern UI with gradients and animations

**Features**:
- Sensor input forms with validation
- Auto-generation of voltammetry signals
- API connection status checking
- Real-time predictions
- Visual results with confidence bars
- Probability distribution display
- Configurable API endpoint

**User Flow**:
1. Check API connection
2. Enter sensor values
3. (Optional) Auto-generate voltammetry
4. Submit prediction request
5. View results with confidence

### 6. Utilities Layer (`ml/utils.py`)

**Purpose**: Shared helper functions

**Functions**:
- Model save/load
- Feature extraction from dictionaries
- Evaluation report generation
- Confusion matrix visualization
- JSON serialization

## Data Flow

### Training Phase

```
generate_dataset.py
    ↓
synthetic_dataset.csv
    ↓
train_model.py
    ↓
    ├─→ Preprocessing
    ├─→ Train Models
    ├─→ Evaluate & Select Best
    └─→ Save Artifacts
```

### Inference Phase

```
Frontend (User Input)
    ↓
HTTP POST /predict
    ↓
Backend API
    ↓
    ├─→ Validate Input
    ├─→ Extract Features
    ├─→ Load Model & Preprocessor
    ├─→ Transform Features
    ├─→ Model Prediction
    └─→ Format Response
    ↓
Frontend (Display Results)
```

## Design Patterns

### 1. Separation of Concerns
- Each module has single responsibility
- Clear interfaces between components
- Easy to modify individual components

### 2. Model Selection Strategy
- Train multiple models
- Compare on validation set
- Automatically select best
- Future: Can add ensemble methods

### 3. Feature Engineering
- Statistical aggregation of time-series
- Maintains signal information
- Compatible with traditional ML

### 4. API Design
- RESTful principles
- JSON input/output
- Error handling
- Health checks

### 5. Reproducibility
- Random seeds
- Deterministic data generation
- Version tracking (model metadata)

## Scalability Considerations

### Current Limitations
- Single model inference (no batch)
- Synchronous API calls
- No caching

### Future Enhancements
- **Batch Prediction**: Accept multiple samples
- **Model Caching**: Redis for frequently used models
- **Async Inference**: Background processing for large batches
- **Model Versioning**: Multiple model versions with A/B testing
- **Database**: Store predictions and user data
- **Microservices**: Split API into separate services
- **Load Balancing**: Multiple API instances

## Security Considerations

### Current State
- Basic CORS configuration
- Input validation via Pydantic
- No authentication (dev setup)

### Production Recommendations
- **Authentication**: JWT tokens or API keys
- **Rate Limiting**: Prevent abuse
- **HTTPS**: Encrypt API communication
- **Input Sanitization**: Additional validation layers
- **Model Security**: Prevent model extraction attacks

## Testing Strategy

### Unit Tests (Recommended)
- Feature extraction functions
- Preprocessing pipeline
- Model training components

### Integration Tests (Recommended)
- End-to-end API testing
- Model inference consistency
- Data pipeline validation

### Load Testing (Recommended)
- API performance under load
- Concurrent request handling
- Response time optimization

## Deployment Options

### Development
- Local execution
- File-based model storage
- Single instance

### Production
- Containerization (Docker)
- Orchestration (Kubernetes)
- Cloud deployment (AWS/GCP/Azure)
- CI/CD pipeline
- Monitoring and logging

---

**Architecture designed for maintainability, extensibility, and production readiness.**

