# Use Python 3.11-slim as base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for ML and other operations
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend, ML models, and frontend
COPY backend/ ./backend/
COPY ml/ ./ml/
COPY frontend/ ./frontend/

# Install Node.js (for frontend build) if you have a React/Vue/Next frontend
# Only needed if your frontend requires building (e.g., npm run build)
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Build frontend if you are using a framework like React or Vue
# Uncomment and modify if your frontend needs building
# WORKDIR /app/frontend
# RUN npm install && npm run build

# Expose port (Render provides $PORT automatically)
EXPOSE 5000

# Set environment variables
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Command to run backend with Uvicorn (Render uses $PORT)
CMD ["sh", "-c", "uvicorn backend.app:app --host 0.0.0.0 --port ${PORT:-5000}"]
