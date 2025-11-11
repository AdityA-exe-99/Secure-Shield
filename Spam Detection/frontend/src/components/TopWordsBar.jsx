import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
export default function TopWordsBar({ items=[] }){
  const labels=items.map(i=>i.word); const weights=items.map(i=>i.weight)
  const data={ labels, datasets:[{ label:'Weight', data:weights, backgroundColor:'rgba(59,130,246,0.7)' }] }
  const options={ responsive:true, plugins:{ legend:{position:'bottom'}, title:{display:true, text:'Top Spam Keywords'} } }
  return <Bar data={data} options={options} />
}