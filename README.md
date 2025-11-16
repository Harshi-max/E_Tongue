# 🌿 E-Tongue for Dravya Identification

A complete production-ready Machine Learning system for identifying Ayurvedic Dravya (herbs) using simulated Electronic Tongue sensor data.

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Generate dataset
cd ml
python generate_dataset.py

# 3. Train models
python train_model.py

# 4. Start backend API
cd ../backend
python app.py

# 5. Open frontend
# Open frontend/index.html in your browser
# Or use: python -m http.server 8080
```

**See [SETUP.md](SETUP.md) for detailed setup instructions.**

## Project Overview

This project implements an **E-Tongue (Electronic Tongue)** system for automated identification of Ayurvedic herbs **without requiring physical hardware**. The system uses machine learning to classify dravya based on simulated sensor readings including pH, conductivity, temperature, and voltammetry signals.

## Description
AI-Powered Ayurvedic Herb Identification Using Simulated Electronic Tongue Sensors

A fully production-grade Machine Learning system that simulates Electronic Tongue (E-Tongue) behavior to classify Ayurvedic herbal substances (Dravya) using synthetic chemical-sensor data. The project requires no physical hardware, yet mimics real-world E-Tongue sensors through statistical modeling and ML.

This system provides end-to-end pipeline: dataset generation → preprocessing → ML model training → REST API → a clean interactive Web Dashboard.
### Key Features

✅ **Synthetic Dataset Generation** - No hardware required  
✅ **Multiple ML Models** - Random Forest, SVM, and optional CNN  
✅ **Production-Ready API** - FastAPI with automatic documentation  
✅ **Interactive Frontend** - Beautiful web interface  
✅ **Complete Documentation** - README, Architecture, API docs  
✅ **1500+ Samples** - 7 Ayurvedic Dravya classes  

## Project Structure

```
e_tongue/
├── ml/                    # Machine Learning Pipeline
│   ├── generate_dataset.py    # Synthetic dataset generation
│   ├── preprocess.py          # Data preprocessing
│   ├── train_model.py         # ML model training
│   └── utils.py               # Helper functions
│
├── backend/                # FastAPI Backend
│   ├── app.py                 # API server
│   └── requirements.txt       # Dependencies
│
├── frontend/               # Web Frontend
│   └── index.html             # Interactive dashboard
│
└── docs/                   # Documentation
    ├── README.md              # Detailed project README
    ├── architecture.md        # System architecture
    └── API_docs.md            # API documentation
```

## How It Works

1. **Dataset Generation**: Creates synthetic sensor data simulating pH, conductivity, temperature, and voltammetry readings for 7 Ayurvedic herbs
2. **Feature Extraction**: Extracts 11 features from sensor data (3 basic + 8 voltammetry statistics)
3. **Model Training**: Trains Random Forest, SVM, and optionally CNN models, selecting the best performer
4. **API Deployment**: Serves predictions via REST API
5. **Frontend Interface**: Provides user-friendly web interface for real-time predictions

## API Endpoints

- `GET /health` - Check API and model status
- `POST /predict` - Predict dravya from sensor data

**See [docs/API_docs.md](docs/API_docs.md) for complete API documentation.**

## Supported Dravya Classes

1. **Neem** - Slightly acidic, moderate conductivity
2. **Turmeric** - Near neutral pH, higher conductivity
3. **Tulsi** - Neutral pH, moderate conductivity
4. **Ginger** - Acidic, high conductivity
5. **Amla** - Highly acidic (characteristic), very high conductivity
6. **Ashwagandha** - Slightly basic, moderate conductivity
7. **Brahmi** - Neutral to slightly basic, lower conductivity

## Requirements

- Python 3.8+
- pip
- Web browser (for frontend)

**See [requirements.txt](requirements.txt) for full dependency list.**

## Documentation

- **[SETUP.md](SETUP.md)** - Complete setup instructions
- **[docs/README.md](docs/README.md)** - Detailed project documentation
- **[docs/architecture.md](docs/architecture.md)** - System architecture
- **[docs/API_docs.md](docs/API_docs.md)** - API documentation

## Future Scope

### Adding Real Sensors

When physical hardware becomes available:

1. Replace dataset generation with sensor reading module
2. Connect to Arduino/Raspberry Pi with sensors
3. Retrain models on real data
4. Deploy on edge devices

**See [docs/README.md](docs/README.md#future-scope) for more details.**

## Troubleshooting

**Model not loading?** → Run `python ml/train_model.py` first  
**API connection failed?** → Start backend with `python backend/app.py`  
**Import errors?** → Install dependencies with `pip install -r requirements.txt`

**See [SETUP.md](SETUP.md#troubleshooting) for more troubleshooting tips.**

## License

This project is provided as-is for educational and research purposes.

## Contributing

Contributions welcome! Areas for improvement:
- Additional dravya classes
- Better synthetic data generation
- Model architecture improvements
- Frontend enhancements
- Documentation improvements

---

**Built with ❤️ for Ayurvedic Medicine and Machine Learning**

For questions or issues, please check the documentation or open an issue.

