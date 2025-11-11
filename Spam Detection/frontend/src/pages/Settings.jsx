import { useState } from 'react'

export default function Settings() {
  const [apiBase, setApiBase] = useState(localStorage.getItem('apiBase') || 'http://127.0.0.1:8000')
  const [defaultModel, setDefaultModel] = useState(localStorage.getItem('defaultModel') || 'Both')
  const [minChars, setMinChars] = useState(Number(localStorage.getItem('minChars') || 10))
  const [savedMsg, setSavedMsg] = useState('')

  function saveSettings(e) {
    e.preventDefault()
    localStorage.setItem('apiBase', apiBase)
    localStorage.setItem('defaultModel', defaultModel)
    localStorage.setItem('minChars', String(Math.max(1, Number(minChars) || 1)))
    setSavedMsg('Settings saved ✓')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  return (
    <div className="container res-wrap">
      <div className="res-card">
        <h2 style={{ color: '#f8fafc', marginBottom: 8 }}>Settings</h2>
        <div className="small" style={{ color: '#94a3b8' }}>
          Configure backend connection and input requirements
        </div>
      </div>

      <form className="res-card" onSubmit={saveSettings}>
        <h3>Backend</h3>

        <label style={{ display: 'block', color: '#cbd5e1', marginTop: 8 }}>
          API Base URL
        </label>
        <input
          value={apiBase}
          onChange={(e) => setApiBase(e.target.value)}
          className="input"
          style={{ width: '100%', marginTop: 4 }}
          placeholder="http://127.0.0.1:8000"
        />

        <label style={{ display: 'block', color: '#cbd5e1', marginTop: 12 }}>
          Default Model
        </label>
        <select
          value={defaultModel}
          onChange={(e) => setDefaultModel(e.target.value)}
          className="input"
        >
          <option value="MultinomialNB">Naïve Bayes</option>
          <option value="LogisticRegression">Logistic Regression</option>
          <option value="Both">Both</option>
        </select>

        <h3 style={{ marginTop: 18 }}>Input</h3>
        <label style={{ display: 'block', color: '#cbd5e1', marginTop: 8 }}>
          Minimum Characters Required
        </label>
        <input
          type="number"
          min={1}
          value={minChars}
          onChange={(e) => setMinChars(e.target.value)}
          className="input"
          style={{ width: 180 }}
        />

        <div className="res-actions" style={{ marginTop: 16 }}>
          <button className="res-btn" type="submit">Save Settings</button>
        </div>

        {savedMsg && (
          <div style={{ color: '#22c55e', textAlign: 'center', marginTop: 8 }}>{savedMsg}</div>
        )}
      </form>
    </div>
  )
}
