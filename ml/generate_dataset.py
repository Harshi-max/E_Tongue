"""
Generate synthetic E-Tongue sensor dataset for Ayurvedic Dravya identification

This script simulates electronic tongue sensor readings without physical hardware.
It generates realistic sensor data with appropriate noise and variation patterns.
"""
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
import random


# Ayurvedic Dravya (herbs) with their characteristic properties
DRAVYA_CLASSES = {
    'Neem': {
        'ph_range': (6.0, 7.5),
        'conductivity_range': (0.8, 1.5),
        'temperature_range': (24, 30),
        'voltammetry_base': 0.3,
        'voltammetry_variance': 0.15
    },
    'Turmeric': {
        'ph_range': (6.5, 7.8),
        'conductivity_range': (1.2, 2.0),
        'temperature_range': (25, 32),
        'voltammetry_base': 0.5,
        'voltammetry_variance': 0.2
    },
    'Tulsi': {
        'ph_range': (6.2, 7.2),
        'conductivity_range': (0.9, 1.6),
        'temperature_range': (24, 28),
        'voltammetry_base': 0.4,
        'voltammetry_variance': 0.18
    },
    'Ginger': {
        'ph_range': (5.8, 6.8),
        'conductivity_range': (1.5, 2.3),
        'temperature_range': (26, 31),
        'voltammetry_base': 0.6,
        'voltammetry_variance': 0.22
    },
    'Amla': {
        'ph_range': (3.5, 4.5),  # Highly acidic
        'conductivity_range': (1.8, 2.8),
        'temperature_range': (24, 29),
        'voltammetry_base': 0.7,
        'voltammetry_variance': 0.25
    },
    'Ashwagandha': {
        'ph_range': (6.8, 7.5),
        'conductivity_range': (1.0, 1.8),
        'temperature_range': (25, 30),
        'voltammetry_base': 0.35,
        'voltammetry_variance': 0.16
    },
    'Brahmi': {
        'ph_range': (6.5, 7.3),
        'conductivity_range': (0.7, 1.4),
        'temperature_range': (24, 27),
        'voltammetry_base': 0.3,
        'voltammetry_variance': 0.14
    }
}


def generate_voltammetry_signal(base_value: float, variance: float, 
                                  n_points: int = 100) -> List[float]:
    """
    Generate synthetic voltammetry signal (time-series electrochemical data)
    
    Simulates cyclic voltammetry or linear sweep voltammetry response
    """
    # Generate time points
    time = np.linspace(0, 10, n_points)
    
    # Create realistic voltammetry signal pattern
    # Peak response with exponential decay and noise
    signal = []
    peak_position = random.uniform(0.3, 0.7)  # Peak at 30-70% of scan
    
    for t in time:
        # Gaussian-like peak with some drift
        value = base_value * np.exp(-((t/time[-1] - peak_position) ** 2) / (2 * 0.1**2))
        
        # Add some harmonic components (simulating redox processes)
        value += 0.1 * base_value * np.sin(2 * np.pi * t / time[-1])
        value += 0.05 * base_value * np.cos(4 * np.pi * t / time[-1])
        
        # Add noise
        value += np.random.normal(0, variance * 0.3)
        
        # Ensure positive values
        value = max(0, value)
        
        signal.append(float(value))
    
    return signal


def generate_sample(dravya_name: str, properties: Dict) -> Dict:
    """
    Generate a single synthetic sensor reading for a given dravya
    
    Returns a dictionary with all sensor measurements
    """
    # Generate pH reading with Gaussian distribution around range midpoint
    ph_range = properties['ph_range']
    ph_mid = (ph_range[0] + ph_range[1]) / 2
    ph_std = (ph_range[1] - ph_range[0]) / 6  # ~99% within range
    ph = np.random.normal(ph_mid, ph_std)
    ph = np.clip(ph, ph_range[0], ph_range[1])
    
    # Generate conductivity reading
    cond_range = properties['conductivity_range']
    cond_mid = (cond_range[0] + cond_range[1]) / 2
    cond_std = (cond_range[1] - cond_range[0]) / 6
    conductivity = np.random.normal(cond_mid, cond_std)
    conductivity = np.clip(conductivity, cond_range[0], cond_range[1])
    
    # Generate temperature reading
    temp_range = properties['temperature_range']
    temp_mid = (temp_range[0] + temp_range[1]) / 2
    temp_std = (temp_range[1] - temp_range[0]) / 6
    temperature = np.random.normal(temp_mid, temp_std)
    temperature = np.clip(temperature, temp_range[0], temp_range[1])
    
    # Generate voltammetry signal
    voltammetry = generate_voltammetry_signal(
        properties['voltammetry_base'],
        properties['voltammetry_variance'],
        n_points=100
    )
    
    return {
        'dravya': dravya_name,
        'ph': float(ph),
        'conductivity': float(conductivity),
        'temperature': float(temperature),
        'voltammetry': voltammetry
    }


def generate_dataset(n_samples_per_class: int = 215, 
                     output_path: str = 'synthetic_dataset.csv',
                     seed: int = 42) -> pd.DataFrame:
    """
    Generate complete synthetic dataset
    
    Args:
        n_samples_per_class: Number of samples to generate for each dravya class
        output_path: Path to save the CSV file
        seed: Random seed for reproducibility
    
    Returns:
        DataFrame with all sensor data
    """
    np.random.seed(seed)
    random.seed(seed)
    
    print("Generating synthetic E-Tongue dataset...")
    print(f"Classes: {list(DRAVYA_CLASSES.keys())}")
    print(f"Samples per class: {n_samples_per_class}")
    
    all_samples = []
    
    for dravya_name, properties in DRAVYA_CLASSES.items():
        print(f"Generating samples for {dravya_name}...")
        for _ in range(n_samples_per_class):
            sample = generate_sample(dravya_name, properties)
            all_samples.append(sample)
    
    # Convert to DataFrame
    # For CSV storage, we'll flatten voltammetry as a list stored as string
    df_data = []
    for sample in all_samples:
        row = {
            'dravya': sample['dravya'],
            'ph': sample['ph'],
            'conductivity': sample['conductivity'],
            'temperature': sample['temperature'],
            'voltammetry': ','.join(map(str, sample['voltammetry']))  # Store as comma-separated string
        }
        df_data.append(row)
    
    df = pd.DataFrame(df_data)
    
    # Shuffle the dataset
    df = df.sample(frac=1, random_state=seed).reset_index(drop=True)
    
    # Save to CSV
    df.to_csv(output_path, index=False)
    
    print(f"\nDataset generated successfully!")
    print(f"Total samples: {len(df)}")
    print(f"Saved to: {output_path}")
    print(f"\nDataset statistics:")
    print(df.groupby('dravya').size())
    print(f"\nFeatures summary:")
    print(df[['ph', 'conductivity', 'temperature']].describe())
    
    return df


if __name__ == "__main__":
    # Generate dataset with ~215 samples per class (total ~1505 samples)
    df = generate_dataset(
        n_samples_per_class=215,
        output_path='synthetic_dataset.csv',
        seed=42
    )

