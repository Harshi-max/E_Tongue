import { useState, useEffect } from 'react'
import axios from 'axios'
import VoltammogramChart from '../components/charts/VoltammogramChart'
import ProbabilityBarChart from '../components/charts/ProbabilityBarChart'
import PHvsConductivityScatter from '../components/charts/PHvsConductivityScatter'
import Toast from '../components/ui/Toast'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'

const API_URL = 'http://localhost:8000'

export default function IdentifyPage() {
  const [ph, setPh] = useState(7.0)
  const [conductivity, setConductivity] = useState(1.5)
  const [temperature, setTemperature] = useState(25.0)
  const [voltammetry, setVoltammetry] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiStatus, setApiStatus] = useState(false)
  const [systemStatus, setSystemStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // Check API health on mount
  useEffect(() => {
    handleRefreshStatus()
  }, [])

  // Generate voltammetry signal
  useEffect(() => {
    generateVoltammetry()
  }, [])

  const handleRefreshStatus = async () => {
    setStatusLoading(true)
    try {
      // Wait for 1 second to show loading indicator
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const response = await axios.get(`${API_URL}/api/status`)
      setSystemStatus(response.data.status)
      
      // Update apiStatus based on status
      setApiStatus(response.data.status === 'OK')
      
      if (response.data.status === 'OK') {
        setToast({ message: 'System status refreshed successfully', type: 'success' })
      } else {
        setToast({ message: 'System status: ERROR', type: 'error' })
      }
    } catch (err) {
      setSystemStatus('ERROR')
      setApiStatus(false)
      setToast({ 
        message: err.response?.data?.detail || 'Failed to refresh system status. Please check the backend server.', 
        type: 'error' 
      })
    } finally {
      setStatusLoading(false)
      // Clear toast after 3 seconds
      setTimeout(() => setToast(null), 3000)
    }
  }

  const generateVoltammetry = () => {
    const nPoints = 100
    const signal = []
    const base = 0.3 + Math.random() * 0.4
    
    for (let i = 0; i < nPoints; i++) {
      const t = i / nPoints
      const value = base * Math.exp(-Math.pow((t - 0.5), 2) / 0.02)
      const noise = (Math.random() - 0.5) * 0.1
      signal.push(Math.max(0, value + noise))
    }
    
    setVoltammetry(signal)
  }

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const response = await axios.post(`${API_URL}/predict`, {
        ph,
        conductivity,
        temperature,
        voltammetry
      })

      setPrediction(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)}
        />
      )}

      {/* API Status */}
      <div className={`card ${apiStatus ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {apiStatus ? (
              <CheckCircle className="text-green-600 mr-2" size={20} />
            ) : (
              <AlertCircle className="text-red-600 mr-2" size={20} />
            )}
            <span className={`font-semibold ${apiStatus ? 'text-green-700' : 'text-red-700'}`}>
              {statusLoading ? 'Checking status...' : (systemStatus === 'OK' ? 'API Connected - Model Loaded' : 'API Not Available - Please start the backend server')}
            </span>
          </div>
          <button 
            onClick={handleRefreshStatus} 
            disabled={statusLoading}
            className="btn-secondary text-sm flex items-center"
          >
            {statusLoading ? (
              <>
                <Loader className="animate-spin mr-2" size={16} />
                Refreshing...
              </>
            ) : (
              'Refresh Status'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Sensor Readings</h2>
            
            {/* pH Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                pH Value: <span className="text-primary-600 font-bold">{ph.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="14"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>7 (Neutral)</span>
                <span>14</span>
              </div>
            </div>

            {/* Conductivity Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conductivity: <span className="text-primary-600 font-bold">{conductivity.toFixed(2)} S/m</span>
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={conductivity}
                onChange={(e) => setConductivity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>1.5</span>
                <span>3.0</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: <span className="text-primary-600 font-bold">{temperature.toFixed(1)}°C</span>
              </label>
              <input
                type="range"
                min="20"
                max="35"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>20°C</span>
                <span>27.5°C</span>
                <span>35°C</span>
              </div>
            </div>

            {/* Voltammetry Signal Generation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voltammetry Signal ({voltammetry.length} points)
              </label>
              <button
                onClick={generateVoltammetry}
                className="btn-secondary w-full mb-2"
              >
                Regenerate Signal
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handlePredict}
                disabled={loading || !apiStatus}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={18} />
                    Processing...
                  </>
                ) : (
                  'Identify Dravya'
                )}
              </button>
              <button
                onClick={() => {
                  setPh(7.0)
                  setConductivity(1.5)
                  setTemperature(25.0)
                  generateVoltammetry()
                  setPrediction(null)
                  setError(null)
                }}
                className="btn-secondary w-full"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Sensor Profile Summary */}
          {prediction && (
            <div className="card bg-gradient-to-br from-primary-50 to-purple-50">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Sensor Profile</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">pH:</span>
                  <span className="font-semibold">{ph.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conductivity:</span>
                  <span className="font-semibold">{conductivity.toFixed(2)} S/m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-semibold">{temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Signal Points:</span>
                  <span className="font-semibold">{voltammetry.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prediction Result Card */}
          {prediction && (
            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Predicted: <span className="text-primary-600">{prediction.predicted_dravya}</span>
                  </h2>
                  <p className="text-sm text-gray-600">
                    Model: {prediction.model_name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-600">
                    {(prediction.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Confidence</div>
                </div>
              </div>
              
              {/* Confidence Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="card bg-red-50 border-2 border-red-200">
              <div className="flex items-center">
                <AlertCircle className="text-red-600 mr-2" size={20} />
                <span className="text-red-700 font-semibold">{error}</span>
              </div>
            </div>
          )}

          {/* Charts */}
          <VoltammogramChart data={voltammetry} />

          {prediction && (
            <>
              <ProbabilityBarChart probabilities={prediction.all_probabilities} />
              <PHvsConductivityScatter 
                currentPoint={prediction ? {
                  ph,
                  conductivity,
                  dravya: prediction.predicted_dravya
                } : null}
              />
            </>
          )}

          {!prediction && !error && (
            <div className="card bg-gray-50 text-center py-12">
              <p className="text-gray-500 text-lg">Enter sensor readings and click "Identify Dravya" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

