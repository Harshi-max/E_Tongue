import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import DashboardHome from './pages/DashboardHome'
import IdentifyPage from './pages/IdentifyPage'
import DatasetPage from './pages/DatasetPage'
import TrainPage from './pages/TrainPage'
import SimulationPage from './pages/SimulationPage'
import ApiTestPage from './pages/ApiTestPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<DashboardHome />} />
                  <Route path="/identify" element={<IdentifyPage />} />
                  <Route path="/dataset" element={<DatasetPage />} />
                  <Route path="/train" element={<TrainPage />} />
                  <Route path="/simulation" element={<SimulationPage />} />
                  <Route path="/api-test" element={<ApiTestPage />} />
                </Routes>
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

