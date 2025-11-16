# Docker Deployment Guide

This guide covers deploying the E-Tongue ML project using Docker across different platforms.

---

## Prerequisites

- Docker installed and running
- Docker Hub account (for cloud deployments)
- Project files structure intact (backend/, ml/, frontend/, requirements.txt)

---

## 1. Local Docker Deployment

### Option A: Using VS Code Tasks

1. **Build the image:**
   - Press `Ctrl+Shift+B` (or `Cmd+Shift+B` on Mac)
   - Select "Docker: Build Image"
   - Wait for the build to complete

2. **Run the container:**
   - Press `Ctrl+Shift+P` and search for "Tasks: Run Task"
   - Select "Docker: Run Container Locally"
   - The application will start on `http://localhost:5000`

3. **View logs:**
   - Run task "Docker: View Logs" to stream container output
   - Run task "Docker: Stop Container" to stop it

### Option B: Using Terminal

```bash
# Build the image
docker build -t e-tongue:latest .

# Run the container
docker run -p 5000:5000 --name e-tongue-local --rm e-tongue:latest

# View logs (in another terminal)
docker logs -f e-tongue-local

# Stop the container
docker stop e-tongue-local
```

### Verification

- API endpoint: `http://localhost:5000`
- Frontend: Check your app.py for frontend serving configuration
- Container logs will show startup messages

---

## 2. Deploy to Render (Docker Web Service)

### Step 1: Prepare Docker Image for Registry

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag e-tongue:latest YOUR_DOCKER_USERNAME/e-tongue:latest

# Push to Docker Hub
docker push YOUR_DOCKER_USERNAME/e-tongue:latest
```

Replace `YOUR_DOCKER_USERNAME` with your Docker Hub username.

### Step 2: Create Render Deployment

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Select "Deploy an existing image from a registry"
4. Enter image URL: `YOUR_DOCKER_USERNAME/e-tongue:latest`
5. Configure:
   - **Name:** `e-tongue-api`
   - **Environment:** `docker`
   - **Instance Type:** Standard ($7/month)
   - **Port:** `5000`
6. Add environment variables (if needed):
   ```
   FLASK_ENV=production
   ```
7. Click "Create Web Service"

### Step 3: Access Your Deployment

- Your API will be live at: `https://e-tongue-api.onrender.com`
- Monitor logs in the Render dashboard

---

## 3. Deploy to Railway (Docker Deployment)

### Step 1: Push Image to Docker Registry

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag e-tongue:latest YOUR_DOCKER_USERNAME/e-tongue:latest

# Push to Docker Hub
docker push YOUR_DOCKER_USERNAME/e-tongue-tongue:latest
```

### Step 2: Create Railway Deployment

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from Docker image"
3. Enter Docker image: `YOUR_DOCKER_USERNAME/e-tongue:latest`
4. Configure:
   - **Service name:** `e-tongue-api`
   - **Port:** `5000`
5. Click "Deploy"

### Step 3: Configure Domain

1. Go to "Settings" → "Networking"
2. Enable "Public Networking"
3. Your API will be available at the generated Railway domain

### Step 4: Add Environment Variables

1. Go to "Settings" → "Variables"
2. Add:
   ```
   FLASK_ENV=production
   ```
3. Redeploy if needed

---

## 4. Deploy to Google Cloud Run (Docker Container)

### Step 1: Setup Google Cloud CLI

```bash
# Install Google Cloud SDK
# Follow instructions at: https://cloud.google.com/sdk/docs/install

# Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with your GCP project ID.

### Step 2: Build and Push to Google Container Registry

```bash
# Configure Docker authentication for GCP
gcloud auth configure-docker

# Build the image with GCP registry tag
docker build -t gcr.io/YOUR_PROJECT_ID/e-tongue:latest .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/e-tongue:latest
```

### Step 3: Deploy to Cloud Run

```bash
gcloud run deploy e-tongue-api \
  --image gcr.io/YOUR_PROJECT_ID/e-tongue:latest \
  --platform managed \
  --region us-central1 \
  --port 5000 \
  --memory 512Mi \
  --cpu 1 \
  --allow-unauthenticated
```

Options explained:
- `--platform managed`: Fully managed Cloud Run
- `--region us-central1`: Change to your preferred region
- `--port 5000`: Backend port from Dockerfile
- `--memory 512Mi`: RAM allocation (adjust based on model size)
- `--allow-unauthenticated`: Public access

### Step 4: Access Your Deployment

```bash
# Get the service URL
gcloud run services describe e-tongue-api --platform managed --region us-central1
```

Your API will be live at the provided URL (typically `https://e-tongue-api-XXXXX.run.app`).

### Step 5: View Logs

```bash
# Stream logs from Cloud Run
gcloud run logs read e-tongue-api --platform managed --region us-central1
```

---

## 5. Environment-Specific Considerations

### For ML Models

If your `model.pkl` is large:

1. **Optimize Dockerfile:**
   ```dockerfile
   # Add build cache for faster rebuilds
   RUN --mount=type=cache,target=/root/.cache
   ```

2. **Use .dockerignore:**
   Create `.dockerignore` file:
   ```
   __pycache__
   *.pyc
   .git
   .env
   .DS_Store
   node_modules
   ```

### For API Configuration

Update `backend/app.py` if needed:
```python
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
```

### For Frontend

If serving frontend from Flask:
```python
@app.route('/')
def serve_frontend():
    return send_from_directory('frontend', 'index.html')
```

---

## 6. Monitoring and Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Model not found | Ensure `ml/` folder is copied in Dockerfile |
| Port already in use | Change local port: `docker run -p 8080:5000 ...` |
| Out of memory | Increase Docker memory allocation in Docker Desktop |
| Dependencies missing | Verify all packages in `requirements.txt` |

### Debug a Running Container

```bash
# Execute bash in running container
docker exec -it e-tongue-local /bin/bash

# View container details
docker inspect e-tongue-local

# Check resource usage
docker stats e-tongue-local
```

---

## 7. Continuous Deployment (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v0
        with:
          project_id: ${{ secrets.GCP_PROJECT_ID }}
          service_account_key: ${{ secrets.GCP_SA_KEY }}
      
      - name: Build and push Docker image
        run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/e-tongue:latest
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy e-tongue-api \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/e-tongue:latest \
            --platform managed \
            --region us-central1
```

---

## 8. Production Best Practices

1. **Security:**
   - Never commit `.env` files
   - Use secrets management for API keys
   - Enable HTTPS on all platforms

2. **Performance:**
   - Set appropriate memory and CPU limits
   - Use multi-stage builds if applicable
   - Enable container logging

3. **Scaling:**
   - Monitor resource usage
   - Set up auto-scaling on Render/Railway/Cloud Run
   - Cache frequently used data

4. **Updates:**
   - Rebuild image for dependency updates
   - Test locally before cloud deployment
   - Use version tags: `e-tongue:v1.0`, `e-tongue:v1.1`, etc.

---

## Quick Reference

| Platform | Command | Notes |
|----------|---------|-------|
| **Local** | `docker run -p 5000:5000 e-tongue:latest` | Development testing |
| **Render** | Push to Docker Hub, link in Render UI | Easy UI-based setup |
| **Railway** | Push to Docker Hub, import in Railway | Similar to Render |
| **Cloud Run** | `gcloud run deploy` | Best for scaling |

---

For questions or issues, check your platform's documentation or the project README.
