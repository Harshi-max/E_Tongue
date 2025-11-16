# API Documentation

## Base URL

```
http://localhost:8000
```

For production, replace with your server URL.

## Authentication

Currently, no authentication is required (development setup).

For production deployment, consider implementing:
- API key authentication
- JWT tokens
- OAuth 2.0

## Endpoints

### 1. Health Check

Check API status and model availability.

**Endpoint:** `GET /health`

**Request:**
```http
GET /health HTTP/1.1
Host: localhost:8000
```

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_name": "random_forest"
}
```

**Status Codes:**
- `200 OK`: API is running
- `503 Service Unavailable`: Model not loaded (run training first)

**Response Fields:**
- `status` (string): `"healthy"` or `"model_not_loaded"`
- `model_loaded` (boolean): Whether ML model is available
- `model_name` (string, optional): Name of loaded model (e.g., "random_forest", "svm", "cnn")

---

### 2. Predict Dravya

Predict Ayurvedic Dravya from sensor readings.

**Endpoint:** `POST /predict`

**Request Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "ph": 7.0,
  "conductivity": 1.5,
  "temperature": 25.0,
  "voltammetry": [0.3, 0.32, 0.35, 0.38, 0.40, ...]
}
```

**Request Parameters:**

| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| `ph` | float | Yes | 0 ≤ ph ≤ 14 | pH value of the solution |
| `conductivity` | float | Yes | ≥ 0 | Electrical conductivity in S/m |
| `temperature` | float | Yes | 0 ≤ temperature ≤ 100 | Temperature in Celsius |
| `voltammetry` | array[float] | Yes | length ≥ 1 | Voltammetry signal as array of float values |

**Example Request:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "ph": 7.2,
    "conductivity": 1.8,
    "temperature": 27.5,
    "voltammetry": [0.3, 0.32, 0.35, 0.38, 0.40, 0.42, 0.45, 0.48, 0.50, 0.52, 0.55, 0.58, 0.60, 0.62, 0.65, 0.68, 0.70, 0.72, 0.75, 0.78, 0.80, 0.82, 0.85, 0.88, 0.90, 0.92, 0.95, 0.98, 1.00, 0.98, 0.95, 0.92, 0.90, 0.88, 0.85, 0.82, 0.80, 0.78, 0.75, 0.72, 0.70, 0.68, 0.65, 0.62, 0.60, 0.58, 0.55, 0.52, 0.50, 0.48, 0.45, 0.42, 0.40, 0.38, 0.35, 0.32, 0.30, 0.28, 0.25, 0.22, 0.20, 0.18, 0.15, 0.12, 0.10, 0.08, 0.05, 0.02, 0.00, 0.02, 0.05, 0.08, 0.10, 0.12, 0.15, 0.18, 0.20, 0.22, 0.25, 0.28, 0.30, 0.32, 0.35, 0.38, 0.40, 0.42, 0.45, 0.48, 0.50, 0.52, 0.55, 0.58, 0.60, 0.62, 0.65, 0.68, 0.70, 0.72, 0.75, 0.78, 0.80]
  }'
```

**Response:**

**Success (200 OK):**
```json
{
  "predicted_dravya": "Turmeric",
  "confidence": 0.95,
  "all_probabilities": {
    "Turmeric": 0.95,
    "Ginger": 0.03,
    "Tulsi": 0.01,
    "Neem": 0.005,
    "Amla": 0.003,
    "Ashwagandha": 0.001,
    "Brahmi": 0.001
  },
  "model_name": "random_forest"
}
```

**Error Responses:**

**400 Bad Request** - Invalid input:
```json
{
  "detail": "Error during prediction: invalid sensor data"
}
```

**503 Service Unavailable** - Model not loaded:
```json
{
  "detail": "Model not loaded. Please train the model first."
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `predicted_dravya` | string | Predicted Ayurvedic herb name |
| `confidence` | float | Confidence score (0-1) for the prediction |
| `all_probabilities` | object | Probability distribution across all classes |
| `model_name` | string | Name of the ML model used for prediction |

**Supported Dravya Classes:**
- Neem
- Turmeric
- Tulsi
- Ginger
- Amla
- Ashwagandha
- Brahmi

---

### 3. Root Endpoint

Get API information.

**Endpoint:** `GET /`

**Request:**
```http
GET / HTTP/1.1
Host: localhost:8000
```

**Response:**
```json
{
  "message": "E-Tongue Dravya Identification API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "predict": "/predict",
    "docs": "/docs"
  }
}
```

---

### 4. Interactive API Documentation

FastAPI provides automatic interactive documentation.

**Endpoint:** `GET /docs`

Access Swagger UI at: `http://localhost:8000/docs`

**Features:**
- Try out endpoints directly
- View request/response schemas
- See example requests

**Alternative:** ReDoc documentation at `/redoc`

---

## Error Handling

### Standard Error Format

All errors follow this structure:
```json
{
  "detail": "Error message description"
}
```

### Common Error Codes

| Status Code | Description | Solution |
|-------------|-------------|----------|
| `400` | Bad Request | Check input validation (ph range, voltammetry format, etc.) |
| `404` | Not Found | Verify endpoint URL |
| `422` | Validation Error | Check request body format (Pydantic validation) |
| `503` | Service Unavailable | Train model first (`python ml/train_model.py`) |
| `500` | Internal Server Error | Check server logs for details |

---

## Rate Limiting

Currently, no rate limiting is implemented (development).

For production, consider:
- Rate limiting per IP
- API key-based quotas
- Request throttling

---

## Example Usage

### Python

```python
import requests

# Health check
response = requests.get("http://localhost:8000/health")
print(response.json())

# Prediction
data = {
    "ph": 7.0,
    "conductivity": 1.5,
    "temperature": 25.0,
    "voltammetry": [0.3] * 100  # 100-point signal
}

response = requests.post(
    "http://localhost:8000/predict",
    json=data
)
result = response.json()
print(f"Predicted: {result['predicted_dravya']}")
print(f"Confidence: {result['confidence']:.2%}")
```

### JavaScript/Node.js

```javascript
// Health check
fetch('http://localhost:8000/health')
  .then(res => res.json())
  .then(data => console.log(data));

// Prediction
const data = {
  ph: 7.0,
  conductivity: 1.5,
  temperature: 25.0,
  voltammetry: Array(100).fill(0.3)
};

fetch('http://localhost:8000/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
})
  .then(res => res.json())
  .then(data => {
    console.log(`Predicted: ${data.predicted_dravya}`);
    console.log(`Confidence: ${(data.confidence * 100).toFixed(2)}%`);
  });
```

### cURL

```bash
# Health check
curl http://localhost:8000/health

# Prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "ph": 7.0,
    "conductivity": 1.5,
    "temperature": 25.0,
    "voltammetry": [0.3, 0.32, 0.35]
  }'
```

---

## Data Formats

### Voltammetry Signal

The voltammetry signal is an array of floating-point numbers representing the electrochemical response over time.

**Recommendations:**
- Minimum length: 1 point
- Typical length: 100 points
- Values: Non-negative floats (representing current/voltage)

**Example:**
```json
"voltammetry": [0.3, 0.32, 0.35, 0.38, 0.40, 0.42, ...]
```

---

## Versioning

Current API version: **1.0.0**

Future versions may introduce:
- Versioned endpoints (`/v1/predict`, `/v2/predict`)
- Backward compatibility
- Deprecation notices

---

## Support

For issues or questions:
1. Check this documentation
2. Review error messages
3. Check server logs
4. Open an issue in the repository

---

**Last Updated**: Initial release
**API Version**: 1.0.0

