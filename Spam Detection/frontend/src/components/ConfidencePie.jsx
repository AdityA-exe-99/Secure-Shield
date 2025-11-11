import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)
export default function ConfidencePie({ spam=0, ham=0 }){
  const data={ labels:['Spam','Ham'], datasets:[{ label:'Confidence Distribution', data:[spam*100, ham*100], backgroundColor:['rgba(239,68,68,0.8)','rgba(34,197,94,0.8)'] }] }
  const options={ plugins:{ legend:{position:'bottom'}, title:{display:true, text:'Confidence Distribution'} } }
  return <Pie data={data} options={options} />
}