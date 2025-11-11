import { NavLink, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import NewScan from './pages/NewScan.jsx'
import Results from './pages/Results.jsx'
import Settings from './pages/Settings.jsx'
import About from './pages/About.jsx'
import { StoreProvider } from './state/store.jsx'
function Nav(){
  return (<div className="navbar"><div className="brand"><div style={{width:28,height:28,borderRadius:8,background:'#1f3b75',display:'flex',alignItems:'center',justifyContent:'center'}}>🛡️</div>SecureShield</div>
    <div className="navlinks"><NavLink to="/" className={({isActive})=>isActive?'active':''}>Dashboard</NavLink><NavLink to="/new" className={({isActive})=>isActive?'active':''}>New Scan</NavLink><NavLink to="/results" className={({isActive})=>isActive?'active':''}>Results</NavLink><NavLink to="/settings" className={({isActive})=>isActive?'active':''}>Settings</NavLink><NavLink to="/about" className={({isActive})=>isActive?'active':''}>About</NavLink></div></div>)
}
export default function App(){ return (<StoreProvider><Nav /><Routes><Route path="/" element={<Dashboard/>}/><Route path="/new" element={<NewScan/>}/><Route path="/results" element={<Results/>}/><Route path="/settings" element={<Settings/>}/><Route path="/about" element={<About/>}/></Routes><div className="footer">© {new Date().getFullYear()} SecureShield</div></StoreProvider>) }