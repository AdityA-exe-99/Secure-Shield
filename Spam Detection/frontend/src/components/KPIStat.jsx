export default function KPIStat({ title, value, subtitle, color='white' }) {
  return (<div className="card kpi"><div className="small">{title}</div><div style={{fontSize:'28px',fontWeight:800,color}}>{value}</div>{subtitle && <div className="small">{subtitle}</div>}</div>)
}