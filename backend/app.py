"""
FastAPI backend for E-Tongue Dravya identification API
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np
import sys
import os

# Add parent directory to path to import ML modules
parent_dir = os.path.join(os.path.dirname(__file__), '..')
sys.path.insert(0, os.path.abspath(parent_dir))

from ml.preprocess import DataPreprocessor
from ml.utils import load_model, extract_features
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException, status

# Import auth utilities
try:
    from .auth import init_db, create_user, authenticate_user, generate_token, verify_token, get_user_by_id
except ImportError:
    from auth import init_db, create_user, authenticate_user, generate_token, verify_token, get_user_by_id

# Initialize database
init_db()

# Security scheme for JWT
security = HTTPBearer()

app = FastAPI(
    title="E-Tongue Dravya Identification API",
    description="API for identifying Ayurvedic Dravya using simulated E-Tongue sensor data",
    version="1.0.0"
)

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and preprocessor
model = None
preprocessor = None
model_metadata = None


class SensorData(BaseModel):
    """Input model for sensor data"""
    ph: float = Field(..., description="pH value", ge=0, le=14)
    conductivity: float = Field(..., description="Conductivity value (S/m)", ge=0)
    temperature: float = Field(..., description="Temperature in Celsius", ge=0, le=100)
    voltammetry: List[float] = Field(
        ..., 
        description="Voltammetry signal as array of float values",
        min_items=1
    )


class PredictionResponse(BaseModel):
    """Response model for predictions"""
    predicted_dravya: str
    confidence: float
    all_probabilities: dict
    model_name: str


class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    model_loaded: bool
    model_name: Optional[str] = None


def load_ml_artifacts():
    """Load ML model and preprocessor"""
    global model, preprocessor, model_metadata
    
    try:
        ml_dir = os.path.join(os.path.dirname(__file__), '..', 'ml')
        model_path = os.path.join(ml_dir, 'model.pkl')
        preprocessor_path = os.path.join(ml_dir, 'preprocessor.pkl')
        metadata_path = os.path.join(ml_dir, 'model_metadata.json')
        
        if not os.path.exists(model_path) or not os.path.exists(preprocessor_path):
            print(f"Warning: Model files not found. API will return errors until model is trained.")
            return False
        
        model = load_model(model_path)
        preprocessor = DataPreprocessor()
        preprocessor.load(preprocessor_path)
        
        # Load metadata if available
        if os.path.exists(metadata_path):
            import json
            with open(metadata_path, 'r') as f:
                model_metadata = json.load(f)
        
        print("ML artifacts loaded successfully!")
        return True
    
    except Exception as e:
        print(f"Error loading ML artifacts: {e}")
        return False


@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    print("Starting E-Tongue API...")
    load_ml_artifacts()


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if model is not None else "model_not_loaded",
        model_loaded=model is not None,
        model_name=model_metadata.get('model_name') if model_metadata else None
    )


@app.get("/api/status")
async def get_status():
    """Simple status endpoint for refresh functionality"""
    return {
        "status": "OK" if (model is not None and preprocessor is not None) else "ERROR"
    }


class SignupRequest(BaseModel):
    """Signup request model"""
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="User password (min 6 characters)")
    name: Optional[str] = Field(None, description="User name")


class LoginRequest(BaseModel):
    """Login request model"""
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class TokenResponse(BaseModel):
    """Token response model"""
    token: str
    email: str
    name: str
    message: str


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user from JWT token"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = get_user_by_id(payload["user_id"])
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


@app.post("/api/signup", response_model=TokenResponse)
async def signup(user_data: SignupRequest):
    """
    User registration endpoint
    Creates a new user account and returns JWT token
    """
    success, message = create_user(
        email=user_data.email,
        password=user_data.password,
        name=user_data.name
    )
    
    if not success:
        raise HTTPException(
            status_code=400,
            detail=message
        )
    
    # Authenticate the newly created user
    auth_success, user = authenticate_user(user_data.email, user_data.password)
    
    if not auth_success or user is None:
        raise HTTPException(
            status_code=500,
            detail="Account created but authentication failed. Please try logging in."
        )
    
    # Generate token
    token = generate_token(user)
    
    return TokenResponse(
        token=token,
        email=user["email"],
        name=user.get("name", ""),
        message="Account created successfully"
    )


@app.post("/api/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """
    User login endpoint
    Authenticates user and returns JWT token
    """
    auth_success, user = authenticate_user(credentials.email, credentials.password)
    
    if not auth_success or user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate token
    token = generate_token(user)
    
    return TokenResponse(
        token=token,
        email=user["email"],
        name=user.get("name", ""),
        message="Login successful"
    )


@app.get("/api/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user information"""
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user.get("name", "")
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(sensor_data: SensorData):
    """
    Predict dravya from sensor data
    
    Accepts sensor readings and returns predicted dravya with confidence score
    """
    if model is None or preprocessor is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please train the model first."
        )
    
    try:
        # Prepare input data
        input_dict = {
            'ph': sensor_data.ph,
            'conductivity': sensor_data.conductivity,
            'temperature': sensor_data.temperature,
            'voltammetry': sensor_data.voltammetry
        }
        
        # Extract features
        features = extract_features(input_dict)
        
        # Transform using preprocessor
        features_scaled = preprocessor.transform(features)
        
        # Make prediction
        # Check if it's a CNN model (TensorFlow/Keras)
        if hasattr(model, 'predict'):
            # Try Keras/TensorFlow model first
            try:
                import tensorflow as tf
                if isinstance(model, tf.keras.Model):
                    # For CNN, need voltammetry signal directly
                    volt_signal = np.array(sensor_data.voltammetry)
                    volt_signal = (volt_signal - volt_signal.mean()) / (volt_signal.std() + 1e-8)
                    volt_signal = volt_signal.reshape(1, len(volt_signal), 1)
                    pred_proba = model.predict(volt_signal, verbose=0)
                    pred_class_idx = np.argmax(pred_proba[0])
                    confidence = float(pred_proba[0][pred_class_idx])
                    all_probas = pred_proba[0]
                else:
                    raise AttributeError("Not a Keras model")
            except (ImportError, AttributeError, TypeError):
                # Scikit-learn model
                pred_proba = model.predict_proba(features_scaled)[0]
                pred_class_idx = model.predict(features_scaled)[0]
                confidence = float(pred_proba[pred_class_idx])
                all_probas = pred_proba
        else:
            # Fallback for other model types
            pred_class_idx = model.predict(features_scaled)[0]
            pred_proba = model.predict_proba(features_scaled)[0]
            confidence = float(pred_proba[pred_class_idx])
            all_probas = pred_proba
        
        # Get class name
        class_names = preprocessor.get_class_names()
        predicted_dravya = class_names[pred_class_idx]
        
        # Create probability dictionary
        all_probabilities = {
            class_names[i]: float(all_probas[i]) 
            for i in range(len(class_names))
        }
        
        # Get model name from metadata
        model_name = model_metadata.get('model_name', 'unknown') if model_metadata else 'unknown'
        
        return PredictionResponse(
            predicted_dravya=predicted_dravya,
            confidence=confidence,
            all_probabilities=all_probabilities,
            model_name=model_name
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error during prediction: {str(e)}"
        )


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "E-Tongue Dravya Identification API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "docs": "/docs"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

