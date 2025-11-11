import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../state/store.jsx'
import ConfidencePie from '../components/ConfidencePie.jsx'
import ConfidenceLine from '../components/ConfidenceLine.jsx'

export default function Results() {
  const { lastResult } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [res, setRes] = useState(null)

  useEffect(() => {
    const viaNav = location.state?.result
    if (viaNav) { setRes(viaNav); return }
    if (lastResult) { setRes(lastResult); return }
    try {
      const cached = sessionStorage.getItem('lastResult')
      if (cached) setRes(JSON.parse(cached))
    } catch {}
  }, [location.state, lastResult])

  if (!res) {
    return (
      <div className="container res-wrap">
        <div className="res-card">No result yet. Run a scan first.</div>
      </div>
    )
  }

  // Collect models
  const nb = res.nb || (res.model === 'MultinomialNB' ? res.result : null)
  const lr = res.lr || (res.model === 'LogisticRegression' ? res.result : null)

  // Winner logic (highest-confidence)
  const toPct = (s) => (s > 1 ? s : s * 100)
  const candidates = []
  if (nb) candidates.push({ name: 'Naïve Bayes', score: toPct(nb.score || 0), label: nb.label })
  if (lr) candidates.push({ name: 'Log. Regression', score: toPct(lr.score || 0), label: lr.label })
  if (!nb && !lr && res.result) {
    candidates.push({ name: res.model || 'Result', score: toPct(res.result.score || 0), label: res.result.label })
  }
  const best = candidates.reduce((a, b) => (b.score > a.score ? b : a), { score: -1, label: 'unknown', name: '—' })

  const confidence = Math.round(best.score * 100) / 100
  const winner = best.name
  const isSpam = (best.label || '').toLowerCase() === 'spam'
  const finalTitle = isSpam ? 'SPAM EMAIL' : 'SAFE EMAIL'
  const finalColor = isSpam ? '#ef4444' : '#22c55e'
  const agree = nb && lr ? nb.label === lr.label : false

  const text = res.text || ''

  // Pie uses winning model score as probability
  const bestScore01 = best.score > 1 ? best.score / 100 : best.score
  const spamProb = isSpam ? bestScore01 : 1 - bestScore01
  const hamProb = 1 - spamProb

  function exportJSON() {
    const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'analysis-result.json'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container res-wrap">
      {/* Summary */}
      <div className="res-card">
        <h2 style={{ color: '#f8fafc', marginBottom: 8 }}>Analysis Report</h2>
        <div className="small" style={{ color: '#94a3b8' }}>Overall Result</div>
        <div style={{ color: finalColor, fontSize: 24, fontWeight: 800 }}>{finalTitle}</div>
        <div style={{ marginTop: 6 }}>
          Confidence Score: <strong>{confidence.toFixed(2)}%</strong>
        </div>
        <div className="row" style={{ gap: 8, marginTop: 10 }}>
          <button className="pill active">{winner}</button>
          {agree && <button className="pill">Models Agree</button>}
          <button className="btn" onClick={exportJSON}>Export</button>
        </div>
      </div>

      {/* Email content */}
      <div className="res-card">
        <h3>Email Content</h3>
        <div className="input" style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1' }}>
          {text || 'N/A'}
        </div>
        <div className="small" style={{ color: '#94a3b8' }}>
          {text.split(/\s+/).filter(Boolean).length} words • {text.length} characters
        </div>
      </div>

      {/* Pie (centered) */}
      <div
        className="res-card res-chart"
        style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        <h3 style={{ marginBottom: 12 }}>Confidence Distribution</h3>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
          <ConfidencePie spam={spamProb} ham={hamProb} />
        </div>
      </div>

      {/* Line (centered) */}
      <div
        className="res-card res-chart"
        style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        <h3 style={{ marginBottom: 12 }}>Confidence Analysis Progression</h3>
        <div style={{ width: '80%', display: 'flex', justifyContent: 'center' }}>
          <ConfidenceLine points={[0.98, 0.985, 0.99, 0.99, 0.99]} />
        </div>
      </div>

      {/* CTA */}
      <div className="res-actions">
        <button className="res-btn" onClick={() => navigate('/new') /* change to '/newscan' if that's your route */}>
          Analyze Another Email
        </button>
      </div>
    </div>
  )
}
