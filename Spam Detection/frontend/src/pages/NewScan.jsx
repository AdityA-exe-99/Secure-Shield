import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postPredict, postPredictFile } from '../services/api.js'
import { useStore } from '../state/store.jsx'

export default function NewScan(){
  const [tab, setTab] = useState('text')
  const [text, setText] = useState('')
  const [model, setModel] = useState('Both')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)
  const { addResult } = useStore()
  const navigate = useNavigate()

  const minChars = 10
  const canSubmit = tab === 'text' ? text.trim().length >= minChars : !!file

  async function analyze(){
    setBusy(true); setError(null)
    try{
      let resp
      if (tab === 'text') {
        resp = await postPredict({ text, model })
      } else {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('model', model)
        resp = await postPredictFile(fd)
      }

      // resp may already be the normalized object; fall back to resp.data if using axios
      const result = resp?.data ?? resp

      // persist so Results can render even after refresh
      try { sessionStorage.setItem('lastResult', JSON.stringify(result)) } catch {}

      // save to global store
      addResult(result)

      // SPA navigation + pass result in route state (renders instantly)
      navigate('/results', { state: { result } })
    } catch (e) {
      setError(e?.response?.data?.detail || 'Prediction failed. Check backend and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <h2>New Email Scan</h2>

      <div className="tabbar">
        <button className={tab==='text'?'tab active':'tab'} onClick={()=>setTab('text')}>Text Analysis</button>
        <button className={tab==='file'?'tab active':'tab'} onClick={()=>setTab('file')}>File Upload</button>
      </div>

      <div className="card">
        <label>Select Model</label>
        <div className="row">
          {['MultinomialNB','LogisticRegression','Both'].map(m=>(
            <button key={m} className={'tab '+(model===m?'active':'')} onClick={()=>setModel(m)}>
              {m==='Both'?'Both Models':m}
            </button>
          ))}
        </div>

        {tab==='text' ? (
          <div style={{marginTop:12}}>
            <label>Email Content</label>
            <textarea rows="8" placeholder="Paste email text here..." value={text} onChange={e=>setText(e.target.value)} />
            <div className="small">
              {text.trim().split(/\s+/).filter(Boolean).length} words • {text.length} characters • Minimum {minChars} characters
            </div>
          </div>
        ) : (
          <div style={{marginTop:12}}>
            <label>Upload .txt or .eml</label>
            <input className="input" type="file" accept=".txt,.eml" onChange={e=>setFile(e.target.files[0])} />
          </div>
        )}

        {error && <div className="card" style={{background:'#171717'}}>Error: {error}</div>}

        <div style={{marginTop:12}}>
          <button className="btn" disabled={!canSubmit || busy} onClick={analyze}>
            {busy?'Analyzing…':'Analyze Email'}
          </button>
        </div>
      </div>
    </div>
  )
}
