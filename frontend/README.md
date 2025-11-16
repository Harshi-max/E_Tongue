# E-Tongue Frontend - Scientific Dashboard

A modern, professional React-based dashboard for the E-Tongue Dravya Identification system.

## Features

- 🎨 **Modern UI** - Clean, scientific design with Tailwind CSS
- 📊 **Interactive Charts** - Recharts for data visualization
- 🔄 **Multi-Page Dashboard** - Six comprehensive pages
- 📱 **Responsive Design** - Works on all screen sizes
- 🎯 **Real-time Updates** - Live API integration

## Pages

1. **Dashboard Home** - Overview with stats and quick actions
2. **Identify Dravya** - Enhanced prediction interface with sliders and charts
3. **Dataset Viewer** - Table view with CSV upload/download
4. **Model Training** - Training interface with history charts
5. **Sensor Simulation** - Interactive signal generation
6. **API Test Console** - Postman-like API testing interface

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Development Server

The frontend runs on `http://localhost:3000` by default.

**Important:** Make sure the backend API is running on `http://localhost:8000`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── charts/          # Chart components
│   │   │   ├── VoltammogramChart.jsx
│   │   │   ├── ProbabilityBarChart.jsx
│   │   │   └── PHvsConductivityScatter.jsx
│   │   └── layout/          # Layout components
│   │       └── DashboardLayout.jsx
│   ├── pages/               # Page components
│   │   ├── DashboardHome.jsx
│   │   ├── IdentifyPage.jsx
│   │   ├── DatasetPage.jsx
│   │   ├── TrainPage.jsx
│   │   ├── SimulationPage.jsx
│   │   └── ApiTestPage.jsx
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Technologies

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Recharts** - Chart library
- **Tailwind CSS** - Utility-first CSS
- **Vite** - Build tool
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Configuration

### API URL

Update the API URL in page components if needed:
```javascript
const API_URL = 'http://localhost:8000'
```

### Vite Proxy

The Vite config includes a proxy for API calls:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

To preview production build:
```bash
npm run preview
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

**Note:** This frontend replaces the original `index.html` file. The old HTML interface is now a full React application.

