import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://e-tongue-2.onrender.com'

export default function PrivateRoute({ children }) {
  const [isValid, setIsValid] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      setLoading(false)
      setIsValid(false)
      return
    }

    // Verify token with backend
    axios.get(`${API_URL}/api/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      setIsValid(true)
    })
    .catch(() => {
      // Token invalid, remove it
      localStorage.removeItem('token')
      setIsValid(false)
    })
    .finally(() => {
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isValid) {
    return <Navigate to="/login" replace />
  }

  return children
}
