import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Search, Database, Brain, Radio, TestTube, TrendingUp, Activity, RefreshCw, Loader } from 'lucide-react'
import Toast from '../components/ui/Toast'

const API_URL = 'https://e-tongue-2.onrender.com'

export default function DashboardHome() {
  const [systemStatus, setSystemStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [apiHealth, setApiHealth] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    handleRefreshStatus()
  }, [])

  const handleRefreshStatus = async () => {
    setStatusLoading(true)
    try {
      // Wait for 1 second to show loading indicator
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const response = await axios.get(`${API_URL}/api/status`)
      setSystemStatus(response.data.status)
      
      // Also get health info for display
      try {
        const healthResponse = await axios.get(`${API_URL}/health`)
        setApiHealth(healthResponse.data)
      } catch (err) {
        setApiHealth(null)
      }
      
      if (response.data.status === 'OK') {
        setToast({ message: 'System status refreshed successfully', type: 'success' })
      } else {
        setToast({ message: 'System status: ERROR', type: 'error' })
      }
    } catch (err) {
      setSystemStatus('ERROR')
      setApiHealth(null)
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
  const stats = [
    { label: 'Total Samples', value: '1,505', color: 'bg-blue-500' },
    { label: 'Dravya Classes', value: '7', color: 'bg-green-500' },
    { label: 'Model Accuracy', value: '94.69%', color: 'bg-purple-500' },
    { label: 'Active Sensors', value: '4', color: 'bg-orange-500' },
  ]

  const quickActions = [
    { icon: Search, label: 'Identify Dravya', path: '/identify', color: 'bg-primary-500' },
    { icon: Database, label: 'View Dataset', path: '/dataset', color: 'bg-green-500' },
    { icon: Brain, label: 'Train Model', path: '/train', color: 'bg-purple-500' },
    { icon: Radio, label: 'Simulate Sensor', path: '/simulation', color: 'bg-orange-500' },
    { icon: TestTube, label: 'API Console', path: '/api-test', color: 'bg-red-500' },
  ]

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

      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <h1 className="text-3xl font-bold mb-2">E-Tongue Dravya Identification</h1>
        <p className="text-primary-100">
          Advanced Machine Learning System for Ayurvedic Herb Classification
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Activity size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={index}
                to={action.path}
                className={`${action.color} p-6 rounded-lg text-white hover:opacity-90 transition-opacity text-center group`}
              >
                <Icon size={32} className="mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold">{action.label}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="mr-2 text-primary-600" />
              System Status
            </h2>
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
                <>
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
                </>
              )}
            </button>
          </div>
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-lg ${
              systemStatus === 'OK' ? 'bg-green-50' : systemStatus === 'ERROR' ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              <span className="text-gray-700">API Server</span>
              <span className={`font-semibold ${
                systemStatus === 'OK' ? 'text-green-600' : systemStatus === 'ERROR' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {statusLoading ? 'Checking...' : (systemStatus === 'OK' ? '● Online' : systemStatus === 'ERROR' ? '● Offline' : '● Unknown')}
              </span>
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg ${
              apiHealth?.model_loaded ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <span className="text-gray-700">ML Model</span>
              <span className={`font-semibold ${
                apiHealth?.model_loaded ? 'text-green-600' : 'text-red-600'
              }`}>
                {statusLoading ? 'Checking...' : (apiHealth?.model_loaded ? '● Loaded' : '● Not Loaded')}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Model Type</span>
              <span className="text-blue-600 font-semibold">
                {apiHealth?.model_name || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700">Accuracy</span>
              <span className="text-purple-600 font-semibold">94.69%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Supported Dravya</h2>
          <div className="grid grid-cols-2 gap-2">
            {['Neem', 'Turmeric', 'Tulsi', 'Ginger', 'Amla', 'Ashwagandha', 'Brahmi'].map((dravya, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                <span className="text-gray-800 font-medium">🌿 {dravya}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

