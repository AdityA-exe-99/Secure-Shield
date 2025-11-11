export default function About(){
  return (<div className="container"><h2>About This Project</h2>
    <div className="grid">
      <div className="card">
        <h3>Project Overview</h3>
        <p>AI-powered spam detection using Multinomial Naïve Bayes and Logistic Regression. React.js frontend and FastAPI backend for real-time analysis.</p>
      </div>
      <div className="card">
        <h3>Multinomial Naïve Bayes</h3>
        <p>Fast probabilistic classifier using word frequency analysis.</p><div className="small">Accuracy: 97.19%
      </div>
    </div>
    <div className="card">
      <h3>Logistic Regression</h3>
      <p>High-precision classifier with interpretable weighted coefficients.</p>
      <div className="small">Accuracy: 97.01%</div>
      </div>
    </div>
  </div>)
}