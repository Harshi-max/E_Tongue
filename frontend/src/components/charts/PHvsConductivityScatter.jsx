import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'

export default function PHvsConductivityScatter({ data, currentPoint, title = "pH vs Conductivity" }) {
  // Sample data if not provided
  const chartData = data || Array.from({ length: 50 }, () => ({
    ph: 5 + Math.random() * 3,
    conductivity: 0.8 + Math.random() * 2,
    dravya: ['Neem', 'Turmeric', 'Tulsi', 'Ginger', 'Amla', 'Ashwagandha', 'Brahmi'][Math.floor(Math.random() * 7)]
  }))

  const colors = {
    'Neem': '#3b82f6',
    'Turmeric': '#f59e0b',
    'Tulsi': '#22c55e',
    'Ginger': '#ef4444',
    'Amla': '#a855f7',
    'Ashwagandha': '#06b6d4',
    'Brahmi': '#ec4899'
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            dataKey="ph" 
            name="pH" 
            label={{ value: 'pH', position: 'insideBottom', offset: -10 }}
            domain={[3, 8]}
            stroke="#6b7280"
          />
          <YAxis 
            type="number" 
            dataKey="conductivity" 
            name="Conductivity" 
            label={{ value: 'Conductivity (S/m)', angle: -90, position: 'insideLeft' }}
            domain={[0, 3]}
            stroke="#6b7280"
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          {Object.keys(colors).map((dravya) => (
            <Scatter
              key={dravya}
              name={dravya}
              data={chartData.filter(d => d.dravya === dravya)}
              fill={colors[dravya]}
            />
          ))}
          {currentPoint && (
            <Scatter
              name="Current Reading"
              data={[currentPoint]}
              fill="#ef4444"
              shape="star"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

