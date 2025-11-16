import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#ef4444', '#f59e0b', '#06b6d4', '#ec4899']

export default function ProbabilityBarChart({ probabilities, title = "Prediction Probabilities" }) {
  if (!probabilities || Object.keys(probabilities).length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <div className="text-center text-gray-500 py-8">No prediction data available</div>
      </div>
    )
  }

  const data = Object.entries(probabilities)
    .map(([name, value]) => ({
      name,
      probability: (value * 100).toFixed(2),
      value: value
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            stroke="#6b7280"
          />
          <YAxis 
            label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Probability']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

