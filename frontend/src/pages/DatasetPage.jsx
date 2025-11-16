import { useState } from 'react'
import { Download, Upload, FileText, Search } from 'lucide-react'

export default function DatasetPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [dataset, setDataset] = useState([])
  const [loading, setLoading] = useState(false)

  // Sample dataset preview (first 20 rows)
  const sampleData = [
    { dravya: 'Neem', ph: 6.8, conductivity: 1.2, temperature: 26.5 },
    { dravya: 'Turmeric', ph: 7.2, conductivity: 1.8, temperature: 27.0 },
    { dravya: 'Tulsi', ph: 6.9, conductivity: 1.3, temperature: 25.8 },
    { dravya: 'Ginger', ph: 6.2, conductivity: 2.1, temperature: 28.5 },
    { dravya: 'Amla', ph: 4.0, conductivity: 2.5, temperature: 26.2 },
    { dravya: 'Ashwagandha', ph: 7.1, conductivity: 1.4, temperature: 27.5 },
    { dravya: 'Brahmi', ph: 6.9, conductivity: 1.0, temperature: 25.0 },
    { dravya: 'Neem', ph: 6.7, conductivity: 1.3, temperature: 26.0 },
    { dravya: 'Turmeric', ph: 7.3, conductivity: 1.9, temperature: 27.2 },
    { dravya: 'Tulsi', ph: 7.0, conductivity: 1.2, temperature: 25.5 },
  ]

  const displayedData = dataset.length > 0 
    ? dataset.filter(row => 
        row.dravya.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sampleData.filter(row => 
        row.dravya.toLowerCase().includes(searchTerm.toLowerCase())
      )

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const text = e.target.result
      const lines = text.split('\n')
      const headers = lines[0].split(',')
      
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',')
          return {
            dravya: values[0],
            ph: parseFloat(values[1]),
            conductivity: parseFloat(values[2]),
            temperature: parseFloat(values[3])
          }
        })
      
      setDataset(data)
      setLoading(false)
    }
    
    reader.readAsText(file)
  }

  const handleDownloadSample = () => {
    // Create CSV content
    const headers = ['dravya', 'ph', 'conductivity', 'temperature']
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => 
        [row.dravya, row.ph, row.conductivity, row.temperature].join(',')
      )
    ].join('\n')

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'e_tongue_sample_dataset.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Dataset Viewer</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadSample}
              className="btn-secondary flex items-center"
            >
              <Download size={18} className="mr-2" />
              Download Sample
            </button>
            <label className="btn-primary flex items-center cursor-pointer">
              <Upload size={18} className="mr-2" />
              Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Dravya name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Dataset Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Samples</div>
          <div className="text-2xl font-bold text-gray-800">
            {dataset.length > 0 ? dataset.length : '1,505'}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Displayed</div>
          <div className="text-2xl font-bold text-gray-800">{displayedData.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Dravya Classes</div>
          <div className="text-2xl font-bold text-gray-800">7</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Features</div>
          <div className="text-2xl font-bold text-gray-800">11</div>
        </div>
      </div>

      {/* Dataset Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dataset...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dravya
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    pH
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conductivity (S/m)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temperature (°C)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">🌿 {row.dravya}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{row.ph.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{row.conductivity.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{row.temperature.toFixed(1)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {displayedData.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No data found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="card bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Dataset Information</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Dataset contains synthetic sensor readings for 7 Ayurvedic Dravya classes</li>
          <li>• Each sample includes: pH, conductivity, temperature, and voltammetry signal</li>
          <li>• Upload your own CSV file to view custom datasets</li>
          <li>• CSV format: dravya,ph,conductivity,temperature,voltammetry</li>
        </ul>
      </div>
    </div>
  )
}

