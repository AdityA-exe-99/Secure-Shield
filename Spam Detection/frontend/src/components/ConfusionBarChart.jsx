import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
export default function ConfusionBarChart({ labels=[], nb=[], lr=[] }){
  const data={ labels, datasets:[{label:'Naïve Bayes', data:nb, backgroundColor:'rgba(59,130,246,0.7)'}, {label:'Log. Regression', data:lr, backgroundColor:'rgba(148,163,184,0.7)'}]}
  const options={ responsive:true, plugins:{ legend:{position:'bottom'}, title:{display:true, text:'Confusion Matrix Comparison'} } }
  return <Bar data={data} options={options} />
}