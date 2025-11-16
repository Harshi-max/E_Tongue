"""
Utility functions for E-Tongue ML pipeline
"""
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
import pickle
import json


def load_model(model_path: str):
    """Load a saved model from pickle file"""
    with open(model_path, 'rb') as f:
        return pickle.load(f)


def save_model(model, model_path: str):
    """Save a model to pickle file"""
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)


def extract_features(data: Dict) -> np.ndarray:
    """
    Extract features from sensor data dictionary
    
    Args:
        data: Dictionary with keys 'ph', 'conductivity', 'temperature', 'voltammetry'
    
    Returns:
        Feature vector as numpy array
    """
    ph = data.get('ph', 7.0)
    conductivity = data.get('conductivity', 0.0)
    temperature = data.get('temperature', 25.0)
    voltammetry = data.get('voltammetry', [])
    
    # Basic features
    features = [ph, conductivity, temperature]
    
    # Voltammetry signal features
    if voltammetry and len(voltammetry) > 0:
        volt_array = np.array(voltammetry)
        features.extend([
            np.mean(volt_array),  # Mean signal
            np.std(volt_array),   # Standard deviation
            np.max(volt_array),   # Peak value
            np.min(volt_array),   # Minimum value
            np.median(volt_array), # Median
            np.percentile(volt_array, 25), # Q1
            np.percentile(volt_array, 75), # Q3
            np.sum(np.abs(np.diff(volt_array))),  # Total variation
        ])
    else:
        # Default values if voltammetry is missing
        features.extend([0.0] * 8)
    
    return np.array(features).reshape(1, -1)


def create_confusion_matrix_plot(y_true, y_pred, class_names, save_path: str):
    """Create and save confusion matrix visualization"""
    from sklearn.metrics import confusion_matrix
    import matplotlib.pyplot as plt
    import seaborn as sns
    
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=class_names, yticklabels=class_names)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig(save_path)
    plt.close()
    
    return cm


def generate_evaluation_report(y_true, y_pred, class_names: List[str]) -> Dict:
    """Generate comprehensive evaluation report"""
    from sklearn.metrics import (
        accuracy_score, precision_score, recall_score, 
        f1_score, classification_report, confusion_matrix
    )
    
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_true, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_true, y_pred, average='weighted', zero_division=0)
    
    report = {
        'accuracy': float(accuracy),
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1),
        'classification_report': classification_report(y_true, y_pred, 
                                                       target_names=class_names),
        'confusion_matrix': confusion_matrix(y_true, y_pred).tolist()
    }
    
    return report


def save_evaluation_report(report: Dict, save_path: str):
    """Save evaluation report to JSON file"""
    # Create a serializable version
    report_copy = {k: v for k, v in report.items() if k != 'classification_report'}
    report_copy['classification_report_text'] = report['classification_report']
    
    with open(save_path, 'w') as f:
        json.dump(report_copy, f, indent=2)
    
    # Also save text report
    txt_path = save_path.replace('.json', '.txt')
    with open(txt_path, 'w') as f:
        f.write("=" * 60 + "\n")
        f.write("EVALUATION REPORT\n")
        f.write("=" * 60 + "\n\n")
        f.write(f"Accuracy: {report['accuracy']:.4f}\n")
        f.write(f"Precision: {report['precision']:.4f}\n")
        f.write(f"Recall: {report['recall']:.4f}\n")
        f.write(f"F1-Score: {report['f1_score']:.4f}\n\n")
        f.write(report['classification_report'])

