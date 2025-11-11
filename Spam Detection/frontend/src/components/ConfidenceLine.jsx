import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
export default function ConfidenceLine({ points=[] }){
  const labels=['Start','25%','50%','75%','End']
  const data={ labels, datasets:[{ label:'Model Confidence', data: points.length? points.map(p=>p*100): [98,97,98.5,99,99], borderColor:'rgba(59,130,246,1)', backgroundColor:'rgba(59,130,246,0.35)', tension:0.4 }] }
  const options={ responsive:true, plugins:{ legend:{position:'bottom'}, title:{display:true, text:'Confidence Analysis Progression'} } }
  return <Line data={data} options={options} />
}