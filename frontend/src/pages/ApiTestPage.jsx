import { useState } from 'react'
import axios from 'axios'
import { Send, Copy, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'

const API_URL = ''

const sampleRequest = {
  ph: 7.0,
  conductivity: 1.5,
  temperature: 25.0,
  voltammetry: [0.3, 0.32, 0.35, 0.38, 0.40, 0.42, 0.45, 0.48, 0.50, 0.52]
}

export default function ApiTestPage() {
  const [requestBody, setRequestBody] = useState(JSON.stringify(sampleRequest, null, 2))
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleSendRequest = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const parsedBody = JSON.parse(requestBody)
      const apiResponse = await axios.post(`${API_URL}/predict`, parsedBody)
      setResponse({
        status: apiResponse.status,
        data: apiResponse.data,
        headers: apiResponse.headers
      })
    } catch (err) {
      setError({
        status: err.response?.status || 'Error',
        message: err.response?.data?.detail || err.message,
        data: err.response?.data
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLoadSample = () => {
    setRequestBody(JSON.stringify(sampleRequest, null, 2))
    setResponse(null)
    setError(null)
  }

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClear = () => {
    setRequestBody(JSON.stringify({}, null, 2))
    setResponse(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">API Test Console</h2>
        <p className="text-gray-600">
          Test the E-Tongue prediction API with custom JSON requests. Similar to Postman.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Request</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleLoadSample}
                  className="btn-secondary text-sm"
                >
                  Load Sample
                </button>
                <button
                  onClick={handleClear}
                  className="btn-secondary text-sm"
                >
                  <Trash2 size={16} className="mr-1" />
                  Clear
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="bg-gray-800 text-green-400 p-2 rounded-t-lg text-sm font-mono">
                POST {API_URL}/predict
              </div>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full h-96 p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-b-lg border-0 focus:ring-2 focus:ring-primary-500"
                placeholder="Enter JSON request body..."
              />
            </div>

            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2" size={18} />
                  Send Request
                </>
              )}
            </button>
          </div>

          {/* API Endpoints Info */}
          <div className="card bg-gray-50">
            <h3 className="text-sm font-semibold mb-2 text-gray-800">Available Endpoints</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="font-mono text-xs bg-white px-2 py-1 rounded mr-2">GET</span>
                <div>
                  <div className="font-semibold">/health</div>
                  <div className="text-gray-600 text-xs">Check API and model status</div>
                </div>
              </div>
              <div className="flex items-start">
                <span className="font-mono text-xs bg-white px-2 py-1 rounded mr-2">POST</span>
                <div>
                  <div className="font-semibold">/predict</div>
                  <div className="text-gray-600 text-xs">Predict dravya from sensor data</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Response Panel */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Response</h3>
              {response && (
                <button
                  onClick={handleCopyResponse}
                  className="btn-secondary text-sm flex items-center"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={16} className="mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-1" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            {loading && (
              <div className="bg-gray-900 rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                <p className="text-green-400 font-mono text-sm">Sending request...</p>
              </div>
            )}

            {error && (
              <div className="space-y-2">
                <div className="bg-red-900 text-red-200 p-3 rounded-t-lg font-mono text-sm">
                  Status: {error.status}
                </div>
                <pre className="bg-gray-900 text-red-400 p-4 rounded-b-lg font-mono text-sm overflow-auto max-h-96">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </div>
            )}

            {response && (
              <div className="space-y-2">
                <div className={`${
                  response.status === 200 ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'
                } p-3 rounded-t-lg font-mono text-sm`}>
                  Status: {response.status} OK
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-b-lg font-mono text-sm overflow-auto max-h-96">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            )}

            {!loading && !error && !response && (
              <div className="bg-gray-900 rounded-lg p-8 text-center border-2 border-dashed border-gray-700">
                <AlertCircle className="mx-auto mb-4 text-gray-600" size={48} />
                <p className="text-gray-400 font-mono text-sm">No response yet</p>
                <p className="text-gray-500 font-mono text-xs mt-2">Send a request to see the response</p>
              </div>
            )}
          </div>

          {/* Response Info */}
          {response && (
            <div className="card bg-green-50 border border-green-200">
              <div className="flex items-center mb-2">
                <CheckCircle className="text-green-600 mr-2" size={20} />
                <h3 className="font-semibold text-green-800">Request Successful</h3>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <div>Predicted: <span className="font-bold">{response.data.predicted_dravya}</span></div>
                <div>Confidence: <span className="font-bold">{(response.data.confidence * 100).toFixed(2)}%</span></div>
                <div>Model: <span className="font-bold">{response.data.model_name}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

