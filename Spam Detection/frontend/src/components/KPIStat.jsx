// a lightweight, dependency-free KPI block with optional icon + accent color
export default function KPIStat({ title, value, subtitle, color, icon }) {
  const iconMap = {
    doc: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="#a6b7e7"/>
        <path d="M14 3v5h5" stroke="#a6b7e7"/>
      </svg>
    ),
    alert: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 9v4" stroke="#ef4444" strokeWidth="2" />
        <circle cx="12" cy="17" r="1" fill="#ef4444" />
        <path d="M10.3 3.5 1.7 18.5A2 2 0 0 0 3.45 21h17.1A2 2 0 0 0 22.3 18.5L13.7 3.5a2 2 0 0 0-3.4 0Z" stroke="#ef4444"/>
      </svg>
    ),
    check: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M20 6 9 17l-5-5" stroke="#22c55e" strokeWidth="2" />
      </svg>
    ),
    trend: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="m3 17 6-6 4 4 7-7" stroke="#93c5fd" strokeWidth="2"/>
      </svg>
    )
  }

  return (
    <div className="card kpi">
      <div className="kpi-top" style={{borderTopColor: color || '#1f3b75'}} />
      <div className="row" style={{alignItems:'center', justifyContent:'space-between'}}>
        <div className="muted small">{title}</div>
        <div className="icon-wrap">{iconMap[icon]}</div>
      </div>
      <div className="kpi-value" style={{color: color || 'var(--text)'}}>{value}</div>
      <div className="muted small">{subtitle}</div>
    </div>
  )
}
