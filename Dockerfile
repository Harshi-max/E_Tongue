# Use Python 3.11-slim as base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for ML and other operations
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend and ML model files
COPY backend/ ./backend/
COPY ml/ ./ml/

# Copy frontend files if needed
COPY frontend/ ./frontend/

# Expose the backend port
EXPOSE 5000

# Set environment variables for production
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Run the backend application with Uvicorn and honor the PORT environment variable (Render provides $PORT)
CMD ["sh", "-c", "uvicorn backend.app:app --host 0.0.0.0 --port ${PORT:-5000}"]
