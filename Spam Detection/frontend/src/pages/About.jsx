export default function About() {
  return (
    <div className="container res-wrap">
      <div className="res-card">
        <h2 style={{ color: '#f8fafc', marginBottom: 8 }}>About Secure Shield</h2>
        <div className="small" style={{ color: '#94a3b8' }}>
          AI-Powered Spam Detection for Safer Communication
        </div>
      </div>

      <div className="res-card">
        <h3>What is Secure Shield?</h3>
        <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
          <strong>Secure Shield</strong> is a full-stack web application that classifies email
          content as <em>Spam</em> or <em>Safe</em> in real-time. It integrates a
          <strong> FastAPI</strong> backend running trained ML pipelines (Naïve Bayes and Logistic
          Regression) with a <strong>React.js</strong> frontend that presents clear, interactive
          visualizations (Chart.js). The goal is to help users identify threats quickly and build
          awareness of common phishing and scam patterns.
        </p>
      </div>

      <div className="res-card">
        <h3>How it Works</h3>
        <ul style={{ color: '#cbd5e1', lineHeight: 1.7, paddingLeft: 18 }}>
          <li>Paste email text or upload a file on the <strong>New Scan</strong> page.</li>
          <li>The backend preprocesses the text and runs it through one or both models.</li>
          <li>We compare model confidence and choose the <strong>highest-confidence</strong> label.</li>
          <li>Results are displayed with an overall decision, confidence score, and charts.</li>
          <li>You can export the structured JSON result for evidence or reporting.</li>
        </ul>
      </div>

      <div className="res-card">
        <h3>Why Two Models?</h3>
        <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
          Using both <strong>Multinomial Naïve Bayes</strong> and
          <strong> Logistic Regression</strong> provides a useful balance of speed and accuracy.
          The app can run either model independently or combine both and pick the result with the
          strongest confidence for better reliability.
        </p>
      </div>

      <div className="res-card">
        <h3>Visualizations</h3>
        <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
          The app includes multiple Chart.js visualizations to communicate results clearly:
        </p>
        <ul style={{ color: '#cbd5e1', lineHeight: 1.7, paddingLeft: 18 }}>
          <li><strong>Confidence Distribution</strong> – pie chart of spam vs safe probability.</li>
          <li><strong>Confidence Analysis Progression</strong> – line graph showing score trend.</li>
        </ul>
      </div>

      <div className="res-card">
        <h3>Data Handling & Privacy</h3>
        <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
          Inputs are processed for prediction and not stored permanently unless you export them.
          We avoid collecting personal identifiers beyond what’s needed to run the classification.
          Errors are handled gracefully and the UI explains issues with actionable messages.
        </p>
      </div>

      <div className="res-card">
        <h3>Team & Acknowledgements</h3>
        <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
          Built by <strong>Session 10 – Group 2</strong> for the unit
          <em> Full-Stack Web Development for AI Application in Cybersecurity Scenarios</em> at
          Swinburne University. We acknowledge open-source tools: FastAPI, scikit-learn, React,
          Vite, and Chart.js.
        </p>
      </div>
    </div>
  )
}
