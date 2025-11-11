import { useState } from 'react'
export default function Settings(){
  const [api] = useState(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  const [minChars, setMinChars] = useState(10)
  return (<div className="container"><h2>Settings</h2>
    <div className="card"><label>API Base URL</label><input className="input" value={api} readOnly /><div className="small">Set via .env → VITE_API_BASE_URL</div></div>
    <div className="card"><label>Minimum Characters</label><input className="input" type="number" min="1" value={minChars} onChange={e=>setMinChars(parseInt(e.target.value||'10'))} /></div>
  </div>)
}