"""
Preprocessing utilities for E-Tongue ML pipeline
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from typing import Tuple
import pickle


class DataPreprocessor:
    """Handles data preprocessing for E-Tongue sensor data"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_names = None
        self.is_fitted = False
    
    def extract_features_from_dataframe(self, df: pd.DataFrame) -> np.ndarray:
        """
        Extract features from DataFrame with sensor readings
        
        Args:
            df: DataFrame with columns 'ph', 'conductivity', 'temperature', 'voltammetry'
        
        Returns:
            Feature matrix (n_samples, n_features)
        """
        features_list = []
        
        for idx, row in df.iterrows():
            # Parse voltammetry signal (stored as comma-separated string)
            if isinstance(row['voltammetry'], str):
                voltammetry = [float(x) for x in row['voltammetry'].split(',')]
            else:
                voltammetry = row['voltammetry'] if isinstance(row['voltammetry'], list) else []
            
            # Extract features
            ph = row['ph']
            conductivity = row['conductivity']
            temperature = row['temperature']
            
            # Basic features
            feature_vector = [ph, conductivity, temperature]
            
            # Voltammetry statistical features
            if len(voltammetry) > 0:
                volt_array = np.array(voltammetry)
                feature_vector.extend([
                    np.mean(volt_array),
                    np.std(volt_array),
                    np.max(volt_array),
                    np.min(volt_array),
                    np.median(volt_array),
                    np.percentile(volt_array, 25),
                    np.percentile(volt_array, 75),
                    np.sum(np.abs(np.diff(volt_array))),
                ])
            else:
                feature_vector.extend([0.0] * 8)
            
            features_list.append(feature_vector)
        
        features = np.array(features_list)
        
        # Store feature names
        if self.feature_names is None:
            self.feature_names = [
                'ph', 'conductivity', 'temperature',
                'volt_mean', 'volt_std', 'volt_max', 'volt_min',
                'volt_median', 'volt_q1', 'volt_q3', 'volt_tv'
            ]
        
        return features
    
    def fit_transform(self, X: np.ndarray, y: np.ndarray = None) -> Tuple[np.ndarray, np.ndarray]:
        """
        Fit preprocessor and transform features
        
        Args:
            X: Feature matrix
            y: Target labels (optional)
        
        Returns:
            Transformed features and encoded labels
        """
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Encode labels if provided
        y_encoded = None
        if y is not None:
            y_encoded = self.label_encoder.fit_transform(y)
        
        self.is_fitted = True
        
        return X_scaled, y_encoded
    
    def transform(self, X: np.ndarray) -> np.ndarray:
        """Transform features using fitted scaler"""
        if not self.is_fitted:
            raise ValueError("Preprocessor must be fitted before transform")
        return self.scaler.transform(X)
    
    def inverse_transform_labels(self, y_encoded: np.ndarray) -> np.ndarray:
        """Convert encoded labels back to original class names"""
        return self.label_encoder.inverse_transform(y_encoded)
    
    def get_class_names(self) -> list:
        """Get list of class names in order"""
        return list(self.label_encoder.classes_)
    
    def save(self, filepath: str):
        """Save preprocessor to file"""
        preprocessor_data = {
            'scaler': self.scaler,
            'label_encoder': self.label_encoder,
            'feature_names': self.feature_names,
            'is_fitted': self.is_fitted
        }
        with open(filepath, 'wb') as f:
            pickle.dump(preprocessor_data, f)
    
    def load(self, filepath: str):
        """Load preprocessor from file"""
        with open(filepath, 'rb') as f:
            preprocessor_data = pickle.load(f)
        
        self.scaler = preprocessor_data['scaler']
        self.label_encoder = preprocessor_data['label_encoder']
        self.feature_names = preprocessor_data['feature_names']
        self.is_fitted = preprocessor_data['is_fitted']


def load_and_preprocess_data(csv_path: str, 
                            preprocessor: DataPreprocessor = None) -> Tuple[np.ndarray, np.ndarray, DataPreprocessor]:
    """
    Load CSV data and preprocess it
    
    Args:
        csv_path: Path to CSV file
        preprocessor: Optional preprocessor (if None, creates new one)
    
    Returns:
        X (features), y (labels), preprocessor
    """
    # Load data
    df = pd.read_csv(csv_path)
    
    # Create preprocessor if not provided
    if preprocessor is None:
        preprocessor = DataPreprocessor()
    
    # Extract features and labels
    X = preprocessor.extract_features_from_dataframe(df)
    y = df['dravya'].values
    
    # Fit and transform
    X_scaled, y_encoded = preprocessor.fit_transform(X, y)
    
    return X_scaled, y_encoded, preprocessor

