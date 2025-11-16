import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LogIn, Mail, Lock, AlertCircle, User, UserPlus } from 'lucide-react'
import Toast from '../components/ui/Toast'

const API_URL = 'http://localhost:8000'

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const endpoint = isSignup ? '/api/signup' : '/api/login'
      const data = isSignup 
        ? { email, password, name: name || undefined }
        : { email, password }

      const response = await axios.post(`${API_URL}${endpoint}`, data)

      // Store JWT token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        setToast({ 
          message: isSignup 
            ? 'Account created successfully! Redirecting...' 
            : 'Login successful! Redirecting...', 
          type: 'success' 
        })
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/')
        }, 1000)
      } else {
        throw new Error('No token received from server')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 
        (isSignup ? 'Signup failed. Please try again.' : 'Login failed. Please check your credentials.')
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setLoading(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  const switchMode = () => {
    setIsSignup(!isSignup)
    setError(null)
    setEmail('')
    setPassword('')
    setName('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌿</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">E-Tongue Dashboard</h1>
          <p className="text-gray-600">
            {isSignup ? 'Create an account to get started' : 'Sign in to access the scientific dashboard'}
          </p>
        </div>

        {/* Login Card */}
        <div className="card shadow-xl">
          {/* Tab Buttons */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsSignup(false)}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
                !isSignup
                  ? 'bg-white text-primary-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <LogIn size={18} className="mr-2" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignup(true)}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
                isSignup
                  ? 'bg-white text-primary-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <UserPlus size={18} className="mr-2" />
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (only for signup) */}
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field pl-10"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
                {isSignup && <span className="text-gray-500 text-xs ml-2">(min 6 characters)</span>}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={isSignup ? 6 : undefined}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                <AlertCircle className="text-red-600 mr-2" size={20} />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isSignup ? 'Creating account...' : 'Logging in...'}
                </>
              ) : (
                <>
                  {isSignup ? (
                    <>
                      <UserPlus className="mr-2" size={18} />
                      Create Account
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2" size={18} />
                      Sign In
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {isSignup 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          E-Tongue Dravya Identification System
        </p>
      </div>
    </div>
  )
}
