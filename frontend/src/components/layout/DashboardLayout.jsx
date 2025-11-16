import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Search, 
  Database, 
  Brain, 
  Radio,
  TestTube,
  Menu,
  X,
  LogOut
} from 'lucide-react'

const sidebarItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/identify', icon: Search, label: 'Identify Dravya' },
  { path: '/dataset', icon: Database, label: 'Dataset Viewer' },
  { path: '/train', icon: Brain, label: 'Model Training' },
  { path: '/simulation', icon: Radio, label: 'Sensor Simulation' },
  { path: '/api-test', icon: TestTube, label: 'API Test Console' },
]

export default function DashboardLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-500 to-blue-600 text-white transition-all duration-300 flex flex-col shadow-xl`}>
        {/* Logo */}
        <div className="p-6 border-b border-blue-400">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl text-white ${sidebarOpen ? 'block' : 'hidden'}`}>
              🌿 E-Tongue
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-blue-400 rounded-lg transition-colors text-white"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {!sidebarOpen && (
            <div className="text-center mt-2 text-white">🌿</div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-white font-medium hover:text-yellow-200 rounded-lg transition-colors duration-200 ${
                  isActive ? 'bg-blue-300 text-black font-bold' : ''
                } ${!sidebarOpen ? 'justify-center' : ''}`}
              >
                <Icon size={20} className={sidebarOpen ? 'mr-3' : ''} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-400">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-4 py-3 text-white font-medium hover:text-yellow-200 hover:bg-blue-400 rounded-lg transition-colors duration-200 ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} className={sidebarOpen ? 'mr-3' : ''} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t border-blue-400 ${sidebarOpen ? 'text-sm' : 'text-xs'} text-white`}>
          {sidebarOpen ? (
            <div>
              <p className="text-white">E-Tongue v1.0</p>
              <p className="text-xs mt-1 text-white">Scientific Dashboard</p>
            </div>
          ) : (
            <div className="text-center text-white">v1.0</div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {sidebarItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Status:</span>
                <span className="ml-2 text-green-600">● Active</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

