import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../state/store.jsx'
import ConfidencePie from '../components/ConfidencePie.jsx'
import TopWordsBar from '../components/TopWordsBar.jsx'
import ConfidenceLine from '../components/ConfidenceLine.jsx'

export default function Results(){
  const { lastResult } = useStore()
  const location = useLocation()
  const [res, setRes] = useState(null)

  useEffect(()=>{
    // 1) prefer data passed during navigation
    const viaNav = location.state?.result
    if (viaNav) { setRes(viaNav); return }

    // 2) then global store
    if (lastResult) { setRes(lastResult); return }

    // 3) finally session storage (survives refresh)
    try {
      const cached = sessionStorage.getItem('lastResult')
      if (cached) setRes(JSON.parse(cached))
    } catch {}
  }, [location.state, lastResult])

  if (!res) {
    return <div className="container"><div className="card">No result yet. Run a scan first.</div></div>
  }

  // Support Both OR single-model responses
  const nb = res.nb || (res.model === 'MultinomialNB' ? res.result : null)
  const lr = res.lr || (res.model === 'LogisticRegression' ? res.result : null)

  const maxScore = Math.max(
    nb?.score ?? 0,
    lr?.score ?? 0,
    res?.result?.score ?? 0
  )

  // If backend returns 0–1, convert to %, otherwise keep as-is
  const toPct = (s)=> (s > 1 ? s : s*100)
  const confidence = Math.round(toPct(maxScore)*10)/10

  const agree = nb && lr ? (nb.label === lr.label) : false
  const winner = nb && lr ? ( (toPct(nb.score) >= toPct(lr.score)) ? 'Naïve Bayes' : 'Log. Regression') : (nb ? 'Result' : '—')

  const text = res.text || ''
  const topWords = res.top_words || res.nb?.top_words || []

  // pie chart needs 0–1
  const nbScore01 = (nb?.score ?? 0) > 1 ? (nb?.score ?? 0)/100 : (nb?.score ?? 0)
  const spamProb = nb?.label === 'spam' ? nbScore01 : 1 - nbScore01
  const hamProb = 1 - spamProb

  function exportJSON(){
    const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'analysis-result.json'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <h2>Analysis Report</h2>

      <div className="card">
        <div className="row" style={{alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div className="small">Overall Result</div>
            <div style={{fontSize:24,fontWeight:800}}>{(nb?.label || res?.result?.label || 'Unknown').toUpperCase()} EMAIL</div>
            <div className="small">Confidence Score: <span className="badge">{confidence}%</span></div>
          </div>
          <div className="row">
            <button className="tab">{winner}</button>
            {agree && <button className="tab">Models Agree</button>}
            <button className="btn" onClick={exportJSON}>Export</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="small">Email Content</div>
        <div className="input" style={{whiteSpace:'pre-wrap'}}>{text || 'N/A'}</div>
        <div className="small">{text.split(/\s+/).filter(Boolean).length} words • {text.length} characters</div>
      </div>

      <div className="grid" style={{marginTop:16}}>
        <div className="card">
          <TopWordsBar items={topWords.slice(0,6)} />
          <div className="small">Based on model coefficients</div>
        </div>
        <div className="card">
          <ConfidencePie spam={spamProb} ham={hamProb} />
        </div>
      </div>

      <div className="card" style={{marginTop:16}}>
        <ConfidenceLine points={[0.98,0.985,0.99,0.99,0.99]} />
      </div>

      <div style={{marginTop:16}}>
        <button className="btn" onClick={()=>window.location.href='/new'}>Analyze Another Email</button>
      </div>
    </div>
  )
}
