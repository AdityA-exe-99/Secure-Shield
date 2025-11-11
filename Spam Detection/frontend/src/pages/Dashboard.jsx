import { useEffect, useState } from 'react'
import KPIStat from '../components/KPIStat.jsx'
import PerformanceBarChart from '../components/PerformanceBarChart.jsx'
import ConfusionBarChart from '../components/ConfusionBarChart.jsx'
import { getMetrics } from '../services/api.js'
export default function Dashboard(){
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    getMetrics()
      .then(({ data }) => setData(data))
      .catch(e => setErr(e?.response?.data?.detail || 'Failed to load metrics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container"><div className="card">Loading dashboard…</div></div>
  if (err) return <div className="container"><div className="card">Error: {err}</div></div>

  const t = data?.totals || { scans:0, spam:0, ham:0, avg_confidence:0 }

  const avgPct = t.avg_confidence > 1
    ? t.avg_confidence / 100   
    : t.avg_confidence * 100   

  return (
    <div className="container">
      <h2>Security Dashboard</h2>
      <div className="small">Monitor your email security in real-time</div>

      <div className="grid grid-4" style={{ marginTop: 12 }}>
        <KPIStat title="Total Scans" value={t.scans.toLocaleString()} subtitle="All time" />
        <KPIStat title="Spam Detected" value={t.spam.toLocaleString()} subtitle={((t.spam/(t.scans||1))*100).toFixed(1)+'% spam rate'} color="#ef4444" />
        <KPIStat title="Safe Emails" value={t.ham.toLocaleString()} subtitle={((t.ham/(t.scans||1))*100).toFixed(1)+'% safe rate'} color="#22c55e" />
        <KPIStat title="Avg Confidence" value={`${avgPct.toFixed(2)}%`} subtitle="Model confidence" color="#93c5fd" />
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <PerformanceBarChart labels={data.comparison.labels} nb={data.comparison.nb} lr={data.comparison.lr} />
        </div>
        <div className="card">
          <ConfusionBarChart labels={data.confusion.labels} nb={data.confusion.nb} lr={data.confusion.lr} />
        </div>
      </div>
    </div>
  )
}