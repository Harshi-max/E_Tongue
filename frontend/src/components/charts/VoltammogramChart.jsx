import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function VoltammogramChart({ data, title = "Voltammetry Signal" }) {
  // Transform data for chart if needed
  const chartData = data && data.length > 0 
    ? data.map((value, index) => ({ time: index, current: value }))
    : Array.from({ length: 100 }, (_, i) => ({ 
        time: i, 
        current: 0.3 + Math.sin(i * 0.1) * 0.2 + Math.random() * 0.1 
      }))

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            label={{ value: 'Time (ms)', position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis 
            label={{ value: 'Current (µA)', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="current" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            name="Voltammetry Signal"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

