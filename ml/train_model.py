"""
Train ML models for E-Tongue Dravya identification

This script trains multiple ML models and selects the best one.
"""
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
import os
import sys

# Import custom modules
from preprocess import load_and_preprocess_data, DataPreprocessor
from utils import (
    save_model, generate_evaluation_report, 
    save_evaluation_report, create_confusion_matrix_plot
)

# Optional: TensorFlow/Keras for CNN
try:
    from tensorflow import keras
    from tensorflow.keras import layers
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("Warning: TensorFlow not available. CNN model will be skipped.")


def build_cnn_model(input_shape: tuple, num_classes: int):
    """Build 1D CNN model for time-series voltammetry data"""
    model = keras.Sequential([
        layers.Input(shape=input_shape),
        layers.Conv1D(32, 3, activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling1D(2),
        layers.Conv1D(64, 3, activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling1D(2),
        layers.Conv1D(128, 3, activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.GlobalAveragePooling1D(),
        layers.Dense(64, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model


def train_random_forest(X_train, y_train, X_val, y_val):
    """Train Random Forest classifier"""
    print("\n" + "="*60)
    print("Training Random Forest Classifier...")
    print("="*60)
    
    # Hyperparameter tuning
    param_grid = {
        'n_estimators': [100, 200],
        'max_depth': [10, 20, None],
        'min_samples_split': [2, 5]
    }
    
    rf_base = RandomForestClassifier(random_state=42, n_jobs=-1)
    grid_search = GridSearchCV(
        rf_base, param_grid, cv=3, 
        scoring='accuracy', n_jobs=-1, verbose=1
    )
    
    grid_search.fit(X_train, y_train)
    
    best_rf = grid_search.best_estimator_
    print(f"Best parameters: {grid_search.best_params_}")
    
    # Evaluate
    train_pred = best_rf.predict(X_train)
    val_pred = best_rf.predict(X_val)
    
    train_acc = accuracy_score(y_train, train_pred)
    val_acc = accuracy_score(y_val, val_pred)
    
    print(f"Train Accuracy: {train_acc:.4f}")
    print(f"Validation Accuracy: {val_acc:.4f}")
    
    return best_rf, val_acc


def train_svm(X_train, y_train, X_val, y_val):
    """Train SVM classifier"""
    print("\n" + "="*60)
    print("Training SVM Classifier...")
    print("="*60)
    
    # For faster training, use smaller parameter grid
    param_grid = {
        'C': [0.1, 1, 10],
        'kernel': ['rbf', 'poly'],
        'gamma': ['scale', 'auto']
    }
    
    svm_base = SVC(random_state=42, probability=True)
    grid_search = GridSearchCV(
        svm_base, param_grid, cv=3,
        scoring='accuracy', n_jobs=-1, verbose=1
    )
    
    grid_search.fit(X_train, y_train)
    
    best_svm = grid_search.best_estimator_
    print(f"Best parameters: {grid_search.best_params_}")
    
    # Evaluate
    train_pred = best_svm.predict(X_train)
    val_pred = best_svm.predict(X_val)
    
    train_acc = accuracy_score(y_train, train_pred)
    val_acc = accuracy_score(y_val, val_pred)
    
    print(f"Train Accuracy: {train_acc:.4f}")
    print(f"Validation Accuracy: {val_acc:.4f}")
    
    return best_svm, val_acc


def train_cnn(X_train, y_train, X_val, y_val, preprocessor, df_train):
    """Train 1D CNN on voltammetry time-series data"""
    if not TENSORFLOW_AVAILABLE:
        return None, 0.0
    
    print("\n" + "="*60)
    print("Training 1D CNN Classifier...")
    print("="*60)
    
    # Extract voltammetry signals for CNN
    def extract_voltammetry(df):
        signals = []
        for idx, row in df.iterrows():
            if isinstance(row['voltammetry'], str):
                signal = np.array([float(x) for x in row['voltammetry'].split(',')])
            else:
                signal = np.array(row['voltammetry'])
            signals.append(signal)
        return np.array(signals)
    
    X_train_volt = extract_voltammetry(df_train.iloc[:len(X_train)])
    X_val_volt = extract_voltammetry(df_train.iloc[len(X_train):len(X_train)+len(X_val)])
    
    # Normalize signals
    X_train_volt = (X_train_volt - X_train_volt.mean()) / (X_train_volt.std() + 1e-8)
    X_val_volt = (X_val_volt - X_val_volt.mean()) / (X_val_volt.std() + 1e-8)
    
    # Reshape for CNN (samples, timesteps, features)
    X_train_volt = X_train_volt.reshape(X_train_volt.shape[0], X_train_volt.shape[1], 1)
    X_val_volt = X_val_volt.reshape(X_val_volt.shape[0], X_val_volt.shape[1], 1)
    
    num_classes = len(np.unique(y_train))
    cnn_model = build_cnn_model(input_shape=(X_train_volt.shape[1], 1), num_classes=num_classes)
    
    # Train
    history = cnn_model.fit(
        X_train_volt, y_train,
        validation_data=(X_val_volt, y_val),
        epochs=50,
        batch_size=32,
        verbose=1
    )
    
    # Evaluate
    val_pred_proba = cnn_model.predict(X_val_volt)
    val_pred = np.argmax(val_pred_proba, axis=1)
    val_acc = accuracy_score(y_val, val_pred)
    
    print(f"Validation Accuracy: {val_acc:.4f}")
    
    return cnn_model, val_acc


def main():
    """Main training pipeline"""
    print("="*60)
    print("E-Tongue ML Model Training Pipeline")
    print("="*60)
    
    # Load and preprocess data
    dataset_path = 'synthetic_dataset.csv'
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        print("Please run generate_dataset.py first!")
        sys.exit(1)
    
    print("\nLoading and preprocessing data...")
    X, y, preprocessor = load_and_preprocess_data(dataset_path)
    
    # Load original dataframe for CNN
    df = pd.read_csv(dataset_path)
    
    print(f"Dataset shape: {X.shape}")
    print(f"Number of classes: {len(np.unique(y))}")
    print(f"Class names: {preprocessor.get_class_names()}")
    
    # Split data
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
    )
    
    print(f"\nData split:")
    print(f"Train: {len(X_train)} samples")
    print(f"Validation: {len(X_val)} samples")
    print(f"Test: {len(X_test)} samples")
    
    # Split dataframe for CNN
    train_idx = len(X_train)
    val_idx = train_idx + len(X_val)
    df_train = df.iloc[:train_idx]
    df_val = df.iloc[train_idx:val_idx]
    
    # Train models
    models = {}
    scores = {}
    
    # Random Forest
    rf_model, rf_score = train_random_forest(X_train, y_train, X_val, y_val)
    models['random_forest'] = rf_model
    scores['random_forest'] = rf_score
    
    # SVM
    svm_model, svm_score = train_svm(X_train, y_train, X_val, y_val)
    models['svm'] = svm_model
    scores['svm'] = svm_score
    
    # CNN (optional)
    if TENSORFLOW_AVAILABLE:
        try:
            cnn_model, cnn_score = train_cnn(X_train, y_train, X_val, y_val, preprocessor, df)
            if cnn_model is not None:
                models['cnn'] = cnn_model
                scores['cnn'] = cnn_score
        except Exception as e:
            print(f"CNN training failed: {e}")
    
    # Select best model
    best_model_name = max(scores, key=scores.get)
    best_model = models[best_model_name]
    best_score = scores[best_model_name]
    
    print("\n" + "="*60)
    print("MODEL COMPARISON")
    print("="*60)
    for name, score in scores.items():
        marker = " <-- BEST" if name == best_model_name else ""
        print(f"{name}: {score:.4f}{marker}")
    
    # Evaluate best model on test set
    print("\n" + "="*60)
    print(f"Evaluating best model ({best_model_name}) on test set...")
    print("="*60)
    
    if best_model_name == 'cnn':
        # For CNN, use voltammetry signals
        X_test_volt = []
        for idx in range(len(X_test)):
            row = df.iloc[val_idx + idx]
            if isinstance(row['voltammetry'], str):
                signal = np.array([float(x) for x in row['voltammetry'].split(',')])
            else:
                signal = np.array(row['voltammetry'])
            X_test_volt.append(signal)
        X_test_volt = np.array(X_test_volt)
        X_test_volt = (X_test_volt - X_test_volt.mean()) / (X_test_volt.std() + 1e-8)
        X_test_volt = X_test_volt.reshape(X_test_volt.shape[0], X_test_volt.shape[1], 1)
        
        test_pred_proba = best_model.predict(X_test_volt)
        test_pred = np.argmax(test_pred_proba, axis=1)
    else:
        test_pred = best_model.predict(X_test)
    
    # Generate evaluation report
    class_names = preprocessor.get_class_names()
    eval_report = generate_evaluation_report(y_test, test_pred, class_names)
    
    print(f"\nTest Set Results:")
    print(f"Accuracy: {eval_report['accuracy']:.4f}")
    print(f"Precision: {eval_report['precision']:.4f}")
    print(f"Recall: {eval_report['recall']:.4f}")
    print(f"F1-Score: {eval_report['f1_score']:.4f}")
    
    # Save model and preprocessor
    print("\nSaving model and preprocessor...")
    save_model(best_model, 'model.pkl')
    preprocessor.save('preprocessor.pkl')
    
    # Save evaluation report
    save_evaluation_report(eval_report, 'evaluation_report.json')
    
    # Create confusion matrix plot
    create_confusion_matrix_plot(
        y_test, test_pred, class_names, 'confusion_matrix.png'
    )
    
    print("\n" + "="*60)
    print("Training complete!")
    print("="*60)
    print(f"Best model: {best_model_name} (saved as model.pkl)")
    print(f"Preprocessor saved as: preprocessor.pkl")
    print(f"Evaluation report saved as: evaluation_report.json")
    print(f"Confusion matrix saved as: confusion_matrix.png")
    
    # Save model metadata
    metadata = {
        'model_name': best_model_name,
        'test_accuracy': float(eval_report['accuracy']),
        'class_names': class_names,
        'feature_names': preprocessor.feature_names,
        'all_scores': {k: float(v) for k, v in scores.items()}
    }
    import json
    with open('model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"Model metadata saved as: model_metadata.json")


if __name__ == "__main__":
    main()

