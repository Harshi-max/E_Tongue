import { useState } from 'react'
import VoltammogramChart from '../components/charts/VoltammogramChart'
import { Sliders, Play, RotateCcw } from 'lucide-react'

export default function SimulationPage() {
  const [bitterLevel, setBitterLevel] = useState(0.5)
  const [sourLevel, setSourLevel] = useState(0.3)
  const [astringentLevel, setAstringentLevel] = useState(0.4)
  const [tempSensitivity, setTempSensitivity] = useState(0.5)
  const [noiseLevel, setNoiseLevel] = useState(0.2)
  const [generatedSignal, setGeneratedSignal] = useState(null)

  const generateSignal = () => {
    const nPoints = 100
    const signal = []
    
    for (let i = 0; i < nPoints; i++) {
      const t = i / nPoints
      
      // Base signal influenced by taste parameters
      let value = 0.2
      
      // Bitter contributes to baseline increase
      value += bitterLevel * 0.3
      
      // Sour creates sharper peaks
      value += sourLevel * 0.4 * Math.exp(-Math.pow((t - 0.3), 2) / 0.05)
      
      // Astringent adds complex oscillations
      value += astringentLevel * 0.2 * Math.sin(t * Math.PI * 4)
      
      // Temperature sensitivity affects peak width
      const peakWidth = 0.1 + tempSensitivity * 0.1
      value *= (1 + tempSensitivity * Math.exp(-Math.pow((t - 0.5), 2) / (2 * peakWidth * peakWidth)))
      
      // Add noise
      const noise = (Math.random() - 0.5) * noiseLevel * 0.5
      value += noise
      
      // Ensure positive values
      value = Math.max(0, Math.min(2.0, value))
      
      signal.push(value)
    }
    
    setGeneratedSignal(signal)
  }

  const resetSimulation = () => {
    setBitterLevel(0.5)
    setSourLevel(0.3)
    setAstringentLevel(0.4)
    setTempSensitivity(0.5)
    setNoiseLevel(0.2)
    setGeneratedSignal(null)
  }

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 flex items-center">
          <Sliders className="mr-2 text-purple-600" size={24} />
          Sensor Signal Simulation
        </h2>
        <p className="text-gray-600">
          Adjust taste parameters to simulate different sensor responses and generate synthetic voltammetry signals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Taste Parameters</h3>
            
            {/* Bitter Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bitter Level: <span className="text-primary-600 font-bold">{(bitterLevel * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={bitterLevel}
                onChange={(e) => setBitterLevel(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>None</span>
                <span>Moderate</span>
                <span>Strong</span>
              </div>
            </div>

            {/* Sour Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sour Level: <span className="text-primary-600 font-bold">{(sourLevel * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={sourLevel}
                onChange={(e) => setSourLevel(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>None</span>
                <span>Moderate</span>
                <span>Strong</span>
              </div>
            </div>

            {/* Astringent Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Astringent Level: <span className="text-primary-600 font-bold">{(astringentLevel * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={astringentLevel}
                onChange={(e) => setAstringentLevel(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>None</span>
                <span>Moderate</span>
                <span>Strong</span>
              </div>
            </div>

            {/* Temperature Sensitivity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature Sensitivity: <span className="text-primary-600 font-bold">{(tempSensitivity * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={tempSensitivity}
                onChange={(e) => setTempSensitivity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            {/* Noise Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Noise Level: <span className="text-primary-600 font-bold">{(noiseLevel * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={generateSignal}
                className="btn-primary w-full flex items-center justify-center"
              >
                <Play className="mr-2" size={18} />
                Generate Signal
              </button>
              <button
                onClick={resetSimulation}
                className="btn-secondary w-full flex items-center justify-center"
              >
                <RotateCcw className="mr-2" size={18} />
                Reset Parameters
              </button>
            </div>
          </div>

          {/* Parameter Summary */}
          {generatedSignal && (
            <div className="card bg-gradient-to-br from-blue-50 to-cyan-50">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Simulation Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Signal Points:</span>
                  <span className="font-semibold">{generatedSignal.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Value:</span>
                  <span className="font-semibold">{Math.max(...generatedSignal).toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Value:</span>
                  <span className="font-semibold">{Math.min(...generatedSignal).toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mean Value:</span>
                  <span className="font-semibold">
                    {(generatedSignal.reduce((a, b) => a + b, 0) / generatedSignal.length).toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visualization Panel */}
        <div className="lg:col-span-2">
          {generatedSignal ? (
            <VoltammogramChart 
              data={generatedSignal} 
              title="Generated Voltammetry Signal"
            />
          ) : (
            <div className="card bg-gray-50 text-center py-16">
              <Sliders size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg mb-2">Adjust parameters and click "Generate Signal"</p>
              <p className="text-gray-400 text-sm">The signal will be generated based on your taste parameter settings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

