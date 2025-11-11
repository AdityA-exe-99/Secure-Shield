// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import PerformanceBarChart from '../components/PerformanceBarChart.jsx'
import ConfusionBarChart from '../components/ConfusionBarChart.jsx'
import { getMetrics } from '../services/api.js'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    getMetrics()
      .then(({ data }) => setData(data))
      .catch(e => setErr(e?.response?.data?.detail || 'Failed to load metrics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className="card">Loading dashboard…</div>
      </div>
    )
  }

  if (err) {
    return (
      <div className="container">
        <div className="card">Error: {err}</div>
      </div>
    )
  }

  const t = data?.totals ?? { scans: 0, spam: 0, ham: 0, avg_confidence: 0 }

  const avgPct = t.avg_confidence > 1
      ? t.avg_confidence / 100   
      : t.avg_confidence * 100

  return (
    <div className="container">
      <h2>Security Dashboard</h2>
      <div className="small">Monitor your email security in real-time</div>

      <div className="grid grid-4" style={{ marginTop: 16 }}>
        <div className="card kpi">
          <h3>Total Scans</h3>
          <p className="value">{t.scans.toLocaleString()}</p>
          <p className="small">All time</p>
        </div>

        <div className="card kpi">
          <h3>Spam Detected</h3>
          <p className="value" style={{ color: '#ef4444' }}>{t.spam.toLocaleString()}</p>
          <p className="small">{((t.spam / (t.scans || 1)) * 100).toFixed(1)}% spam rate</p>
        </div>

        <div className="card kpi">
          <h3>Safe Emails</h3>
          <p className="value" style={{ color: '#22c55e' }}>{t.ham.toLocaleString()}</p>
          <p className="small">{((t.ham / (t.scans || 1)) * 100).toFixed(1)}% safe rate</p>
        </div>

        <div className="card kpi">
          <h3>Avg Confidence</h3>
          <p className="value" style={{ color: '#3b82f6' }}>{`${avgPct.toFixed(2)}%`}</p>
          <p className="small">Model confidence</p>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card chart">
          <h3>Model Performance</h3>
          <div className="chart-body">
            <PerformanceBarChart
              labels={data?.comparison?.labels || []}
              nb={data?.comparison?.nb || []}
              lr={data?.comparison?.lr || []}
              height={300}
            />
          </div>
        </div>

        <div className="card chart">
          <h3>Confusion Matrix</h3>
          <div className="chart-body">
            <ConfusionBarChart
              labels={data?.confusion?.labels || []}
              nb={data?.confusion?.nb || []}
              lr={data?.confusion?.lr || []}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  )
}