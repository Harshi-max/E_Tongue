"""
Quick start script for E-Tongue Dravya Identification system

This script helps you run the complete pipeline:
1. Generate dataset (if not exists)
2. Train models (if not exists)
3. Start backend API
4. Optionally open frontend

Usage:
    python run.py [--skip-dataset] [--skip-training] [--no-frontend]
"""
import os
import sys
import subprocess
import argparse
from pathlib import Path


def check_file_exists(filepath):
    """Check if file exists"""
    return os.path.exists(filepath)


def run_command(command, cwd=None, description=""):
    """Run a command and handle errors"""
    print(f"\n{'='*60}")
    print(f"{description}")
    print(f"{'='*60}")
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd,
            check=True,
            capture_output=False
        )
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Run E-Tongue Dravya Identification system"
    )
    parser.add_argument(
        '--skip-dataset',
        action='store_true',
        help='Skip dataset generation (use existing dataset)'
    )
    parser.add_argument(
        '--skip-training',
        action='store_true',
        help='Skip model training (use existing model)'
    )
    parser.add_argument(
        '--no-frontend',
        action='store_true',
        help='Do not open frontend in browser'
    )
    
    args = parser.parse_args()
    
    # Get project root
    project_root = Path(__file__).parent
    ml_dir = project_root / "ml"
    backend_dir = project_root / "backend"
    frontend_dir = project_root / "frontend"
    
    print("="*60)
    print("E-Tongue Dravya Identification - Quick Start")
    print("="*60)
    
    # Step 1: Generate Dataset
    if not args.skip_dataset:
        dataset_path = ml_dir / "synthetic_dataset.csv"
        if check_file_exists(dataset_path):
            print(f"\nDataset already exists: {dataset_path}")
            response = input("Regenerate dataset? (y/n): ").strip().lower()
            if response != 'y':
                print("Skipping dataset generation...")
            else:
                if not run_command(
                    "python generate_dataset.py",
                    cwd=str(ml_dir),
                    description="Generating synthetic dataset..."
                ):
                    print("Dataset generation failed!")
                    return
        else:
            if not run_command(
                "python generate_dataset.py",
                cwd=str(ml_dir),
                description="Generating synthetic dataset..."
            ):
                print("Dataset generation failed!")
                return
    else:
        print("\nSkipping dataset generation...")
    
    # Step 2: Train Models
    if not args.skip_training:
        model_path = ml_dir / "model.pkl"
        if check_file_exists(model_path):
            print(f"\nModel already exists: {model_path}")
            response = input("Retrain models? (y/n): ").strip().lower()
            if response != 'y':
                print("Skipping model training...")
            else:
                if not run_command(
                    "python train_model.py",
                    cwd=str(ml_dir),
                    description="Training ML models..."
                ):
                    print("Model training failed!")
                    return
        else:
            if not run_command(
                "python train_model.py",
                cwd=str(ml_dir),
                description="Training ML models..."
            ):
                print("Model training failed!")
                return
    else:
        print("\nSkipping model training...")
    
    # Verify model exists
    model_path = ml_dir / "model.pkl"
    preprocessor_path = ml_dir / "preprocessor.pkl"
    
    if not check_file_exists(model_path) or not check_file_exists(preprocessor_path):
        print("\n" + "="*60)
        print("ERROR: Model files not found!")
        print("Please train the model first:")
        print(f"  cd ml")
        print(f"  python train_model.py")
        print("="*60)
        return
    
    # Step 3: Start Backend API
    print("\n" + "="*60)
    print("Starting Backend API...")
    print("="*60)
    print("API will be available at: http://localhost:8000")
    print("API docs available at: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server")
    print("="*60)
    
    # Start backend (this will block)
    try:
        import uvicorn
        sys.path.insert(0, str(backend_dir))
        os.chdir(backend_dir)
        uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
    except ImportError:
        print("\nStarting backend with subprocess...")
        run_command(
            "python app.py",
            cwd=str(backend_dir),
            description="Starting backend API..."
        )
    except Exception as e:
        print(f"\nError starting backend: {e}")
        print("Please start manually:")
        print(f"  cd backend")
        print(f"  python app.py")


if __name__ == "__main__":
    main()

