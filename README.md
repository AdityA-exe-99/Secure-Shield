# SecureShield (Frontend - React JS)

A React (Vite) frontend for the Spam Detection project. Built to satisfy the COS30049 Assignment 3 rubric with:

- Clean routing and UI (Dashboard, New Scan, Results, Settings, About)
- Robust error handling & validation
- Model integration via a FastAPI backend
- At least **three** chart types (Bar, Pie, Line) using Chart.js (`react-chartjs-2`)
- Export feature for prediction results (JSON)

## Quick Start

```bash
# 1) Configure API
cp .env.example .env
# edit .env if needed (defaults to http://127.0.0.1:8000)

# 2) Install and run
npm install
npm run dev
# open http://localhost:5173
```

## Expected Backend Endpoints

Frontend expects these endpoints from FastAPI:

- `GET /health` → `{ "status": "ok" }`
- `GET /metrics` →
  ```json
  {
    "totals": {
      "scans": 2750,
      "spam": 1120,
      "ham": 1630,
      "avg_confidence": 96.4
    },
    "comparison": {
      "labels": ["Accuracy", "Precision", "Recall", "F1"],
      "nb": [0.95, 0.93, 0.94, 0.94],
      "lr": [0.96, 0.95, 0.93, 0.94]
    },
    "confusion": {
      "labels": [
        "True Positive",
        "True Negative",
        "False Positive",
        "False Negative"
      ],
      "nb": [820, 880, 30, 40],
      "lr": [780, 900, 20, 60]
    }
  }
  ```
- `POST /predict` (JSON body `{ "text": "...", "model": "MultinomialNB|LogisticRegression|Both" }`) →
  ```json
  {
    "text": "...",
    "nb": {
      "label": "spam",
      "score": 0.96,
      "top_words": [{ "word": "free", "weight": 2.5 }]
    },
    "lr": {
      "label": "ham",
      "score": 0.95,
      "top_words": [{ "word": "offer", "weight": 1.4 }]
    }
  }
  ```
- `POST /predict-file` (multipart with `file`, `model`) → same shape as `/predict`

> **_Note_**: These shapes match the UI. If your backend differs, adjust `src/services/api.js` and the pages accordingly.

## Pages

- **Dashboard**: KPIs + two bar charts (performance & confusion matrix)
- **New Scan**: Tabbed form (Text / File upload), model selector, validation (min characters)
- **Results**: Overall decision, confidence score, top spam keywords (bar), confidence distribution (pie), confidence progression (line), export JSON
- **Settings**: `.env` guidance and min character option (client-only)
- **About**: Static info cards

## Tech Stack

- React 18 + Vite
- React Router 6
- Axios
- Chart.js 4 + react-chartjs-2
- Minimal custom CSS (dark theme)

## Quality & Rubric Mapping

- **Error Handling & Validation**: try/catch around Axios; clear user messages; min text length; file type accept filter
- **API Design (frontend usage)**: uses proper methods (GET/POST, multipart)
- **Charts**: 4 visualizations; responsive; legends/tooltips via Chart.js
- **Structure & Comments**: modular components and pages; `services/api.js`; `state/store.js`
- **Execution**: `npm run dev` with `.env` config

---

If you need a sample FastAPI adapter for your Assignment 2 model, see the course Workshop 10/11 notes for dependency setup and uvicorn commands.
