import { useState } from 'react'
import axios from 'axios'
import { Brain, Play, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const API_URL = 'https://e-tongue-2.onrender.com'

export default function TrainPage() {
  const [selectedModel, setSelectedModel] = useState('random_forest')
  const [training, setTraining] = useState(false)
  const [trainingResults, setTrainingResults] = useState(null)
  const [error, setError] = useState(null)

  // Sample training history data
  const trainingHistory = [
    { epoch: 1, accuracy: 0.85, loss: 0.45 },
    { epoch: 2, accuracy: 0.89, loss: 0.32 },
    { epoch: 3, accuracy: 0.91, loss: 0.28 },
    { epoch: 4, accuracy: 0.93, loss: 0.22 },
    { epoch: 5, accuracy: 0.94, loss: 0.18 },
    { epoch: 6, accuracy: 0.945, loss: 0.15 },
    { epoch: 7, accuracy: 0.948, loss: 0.13 },
    { epoch: 8, accuracy: 0.949, loss: 0.12 },
    { epoch: 9, accuracy: 0.950, loss: 0.11 },
    { epoch: 10, accuracy: 0.952, loss: 0.10 },
  ]

  // Sample confusion matrix
  const confusionMatrix = [
    ['', 'Neem', 'Turmeric', 'Tulsi', 'Ginger', 'Amla', 'Ashwagandha', 'Brahmi'],
    ['Neem', 210, 2, 1, 0, 0, 2, 0],
    ['Turmeric', 1, 208, 3, 2, 0, 1, 0],
    ['Tulsi', 0, 2, 212, 0, 0, 1, 0],
    ['Ginger', 0, 1, 0, 211, 2, 1, 0],
    ['Amla', 0, 0, 0, 1, 214, 0, 0],
    ['Ashwagandha', 2, 1, 1, 0, 0, 211, 0],
    ['Brahmi', 0, 0, 1, 0, 0, 0, 214],
  ]

  const handleTrain = async () => {
    setTraining(true)
    setError(null)
    setTrainingResults(null)

    try {
      // Simulate training (in production, this would call /train endpoint)
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setTrainingResults({
        model: selectedModel,
        accuracy: 0.9469,
        precision: 0.9498,
        recall: 0.9469,
        f1_score: 0.9473,
        training_time: '2.5 minutes',
        samples_trained: 1053,
        validation_samples: 226,
        test_samples: 226
      })
    } catch (err) {
      setError(err.response?.data?.detail || 'Training failed. Please check the backend server.')
    } finally {
      setTraining(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Training Configuration */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
          <Brain className="mr-2 text-primary-600" size={24} />
          Model Training Configuration
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select ML Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="input-field"
              disabled={training}
            >
              <option value="random_forest">Random Forest Classifier</option>
              <option value="svm">Support Vector Machine (SVM)</option>
              <option value="ann">Artificial Neural Network (ANN)</option>
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Model Description</h3>
            <p className="text-sm text-gray-600">
              {selectedModel === 'random_forest' && 'Ensemble method using multiple decision trees for robust classification.'}
              {selectedModel === 'svm' && 'Kernel-based classifier excellent for non-linear pattern recognition.'}
              {selectedModel === 'ann' && 'Deep learning network with multiple hidden layers for complex feature extraction.'}
            </p>
          </div>

          <button
            onClick={handleTrain}
            disabled={training}
            className="btn-primary w-full flex items-center justify-center"
          >
            {training ? (
              <>
                <Loader className="animate-spin mr-2" size={18} />
                Training in progress...
              </>
            ) : (
              <>
                <Play className="mr-2" size={18} />
                Train Model
              </>
            )}
          </button>
        </div>
      </div>

      {/* Training Results */}
      {trainingResults && (
        <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center mb-4">
            <CheckCircle className="text-green-600 mr-2" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Training Completed Successfully!</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600">Model</div>
              <div className="text-lg font-bold text-gray-800">{trainingResults.model}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Accuracy</div>
              <div className="text-lg font-bold text-green-600">{(trainingResults.accuracy * 100).toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Precision</div>
              <div className="text-lg font-bold text-purple-600">{(trainingResults.precision * 100).toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Training Time</div>
              <div className="text-lg font-bold text-blue-600">{trainingResults.training_time}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Samples Trained:</span>
              <span className="font-semibold ml-2">{trainingResults.samples_trained}</span>
            </div>
            <div>
              <span className="text-gray-600">Validation Samples:</span>
              <span className="font-semibold ml-2">{trainingResults.validation_samples}</span>
            </div>
            <div>
              <span className="text-gray-600">Test Samples:</span>
              <span className="font-semibold ml-2">{trainingResults.test_samples}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="card bg-red-50 border-2 border-red-200">
          <div className="flex items-center">
            <AlertCircle className="text-red-600 mr-2" size={20} />
            <span className="text-red-700 font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* Training History Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Training History</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trainingHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} stroke="#6b7280" />
            <YAxis 
              yAxisId="left"
              label={{ value: 'Accuracy', angle: -90, position: 'insideLeft' }}
              stroke="#22c55e"
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              label={{ value: 'Loss', angle: 90, position: 'insideRight' }}
              stroke="#ef4444"
            />
            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} name="Accuracy" />
            <Line yAxisId="right" type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} name="Loss" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Confusion Matrix */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Confusion Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-gray-50">
                {confusionMatrix[0].map((header, idx) => (
                  <th key={idx} className="px-4 py-2 font-semibold text-gray-700 border border-gray-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {confusionMatrix.slice(1).map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className={`px-4 py-2 border border-gray-200 ${
                        cellIdx === rowIdx + 1 && rowIdx === cellIdx - 1
                          ? 'bg-green-100 font-bold text-green-700'
                          : cellIdx === 0
                          ? 'bg-gray-50 font-semibold'
                          : 'bg-white'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

