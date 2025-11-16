# Frontend Setup Instructions

## Quick Start

### Prerequisites
- Node.js 16+ and npm installed
- Backend API running on `http://localhost:8000`

### Steps

1. **Navigate to frontend directory**
   ```bash
   cd e_tongue/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Navigate to `http://localhost:3000`
   - The dashboard will automatically load

## Migration from Old HTML Interface

The old `index.html` file has been replaced with a React application. All functionality is preserved and enhanced:

- ✅ All existing API calls work
- ✅ Prediction logic maintained
- ✅ Enhanced UI with charts
- ✅ Multi-page navigation

## Features Overview

### Dashboard Home (`/`)
- System overview
- Quick stats
- Quick action cards
- System status

### Identify Dravya (`/identify`)
- Enhanced slider controls (replaces text inputs)
- Live voltammetry chart preview
- Probability bar chart
- pH vs Conductivity scatter plot
- Sensor profile summary card

### Dataset Viewer (`/dataset`)
- Data table with search
- CSV upload functionality
- Download sample dataset
- Dataset statistics

### Model Training (`/train`)
- Model selection dropdown
- Training progress visualization
- Training history chart
- Confusion matrix display

### Sensor Simulation (`/simulation`)
- Interactive taste parameter sliders
- Real-time signal generation
- Signal visualization

### API Test Console (`/api-test`)
- JSON request/response viewer
- Postman-like interface
- Sample request templates

## Troubleshooting

### Port Already in Use
If port 3000 is busy, Vite will automatically try the next available port.

### API Connection Issues
- Verify backend is running: `curl http://localhost:8000/health`
- Check API URL in page components
- Ensure CORS is enabled in backend

### Build Errors
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

### Module Not Found
- Run `npm install` again
- Check that all dependencies are in `package.json`

## Production Deployment

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Serve the dist folder**
   - Use any static file server
   - Or deploy to Vercel, Netlify, etc.

3. **Configure API URL**
   - Update API URLs in components for production
   - Or use environment variables

## Development Tips

- Hot reload is enabled - changes appear instantly
- Use React DevTools browser extension
- Check console for API errors
- Network tab shows all API requests

