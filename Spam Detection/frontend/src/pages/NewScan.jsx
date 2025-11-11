import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postPredict, postPredictFile } from '../services/api.js'
import { useStore } from '../state/store.jsx'

export default function NewScan() {
  const [tab, setTab] = useState('text')            // 'text' | 'file'
  const [model, setModel] = useState('Both')        // 'MultinomialNB' | 'LogisticRegression' | 'Both'
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const { addResult } = useStore()
  const navigate = useNavigate()

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length
  const minChars = 10
  const canSubmit = tab === 'text' ? chars >= minChars : !!file

  async function analyze() {
    if (!canSubmit || busy) return
    setBusy(true); setError(null)

    try {
      let resp
      if (tab === 'text') {
        resp = await postPredict({ text, model })
      } else {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('model', model)
        resp = await postPredictFile(fd)
      }

      const result = resp?.data ?? resp
      sessionStorage.setItem('lastResult', JSON.stringify(result))
      addResult(result)
      navigate('/results', { state: { result } })
    } catch (e) {
      setError(e?.response?.data?.detail || 'Prediction failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container ns-wrap">
      <div className="ns-header">
        <div className="ns-title">
          <h2>New Email Scan</h2>
        </div>

        {/* pill tabs */}
        <div className="pill-tabs">
          <button
            className={`pill ${tab === 'text' ? 'active' : ''}`}
            onClick={() => setTab('text')}
          >
            Text Analysis
          </button>
          <button
            className={`pill ${tab === 'file' ? 'active' : ''}`}
            onClick={() => setTab('file')}
          >
            File Upload
          </button>
        </div>
      </div>

      {/* Select Model */}
      <div className="card ns-card">
        <div className="ns-section-title">Select Model</div>
        <div className="ns-model-row">
          <button
            className={`model-card ${model === 'MultinomialNB' ? 'active' : ''}`}
            onClick={() => setModel('MultinomialNB')}
          >
            <div className="model-title">Naïve Bayes</div>
            <div className="model-sub">Fast</div>
          </button>

          <button
            className={`model-card ${model === 'LogisticRegression' ? 'active' : ''}`}
            onClick={() => setModel('LogisticRegression')}
          >
            <div className="model-title">Logistic Regression</div>
            <div className="model-sub">Precise</div>
          </button>

          <button
            className={`model-card wide ${model === 'Both' ? 'active' : ''}`}
            onClick={() => setModel('Both')}
          >
            <div className="model-title">Both Models</div>
            <div className="model-sub">Compare</div>
          </button>
        </div>
      </div>

      {/* Input area */}
      <div className="card ns-card">
        <div className="ns-section-title">Email Content</div>

        {tab === 'text' ? (
          <>
            <textarea
              className="ns-textarea"
              placeholder="Paste email text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="ns-meta">
              <span>{words} words • {chars} characters</span>
              <span className={chars < minChars ? 'ns-min ns-danger' : 'ns-min'}>
                Minimum {minChars} characters
              </span>
            </div>
          </>
        ) : (
          <div className="ns-upload">
            <input
              type="file"
              accept=".txt,.eml"
              onChange={(e) => setFile(e.target.files[0])}
              className="input"
            />
            <div className="small">Upload a .txt or .eml file</div>
          </div>
        )}
      </div>

      {error && (
        <div className="card ns-error">
          {error}
        </div>
      )}

      <div className="ns-footer">
        <button
          className="btn ns-submit"
          disabled={!canSubmit || busy}
          onClick={analyze}
        >
          {busy ? 'Analyzing…' : 'Analyze Email'}
        </button>
      </div>
    </div>
  )
}
