# app/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import PredictIn, PredictOut, MetricsOut
from app.models_io import load_all, predict_text
from app import metrics
import time

app = FastAPI(title="SecureShield Backend", version="1.0.0")

# CORS – match your frontend dev URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models at startup
@app.on_event("startup")
def _startup():
    load_all()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/metrics", response_model=MetricsOut)
def get_metrics():
    return metrics.snapshot()

@app.post("/predict", response_model=PredictOut)
def predict(payload: PredictIn):
    text = payload.text.strip()
    if len(text) < 10:
        raise HTTPException(status_code=422, detail="Minimum 10 characters required.")

    t0 = time.time()
    if payload.model == "Both":
        nb = predict_text(text, "MultinomialNB")
        lr = predict_text(text, "LogisticRegression")
        elapsed = int((time.time() - t0) * 1000)
        # record best confidence for dashboard
        best = nb if nb["score"] >= lr["score"] else lr
        metrics.record(best["label"], best["score"])
        return {"text": text, "model": "Both", "nb": nb, "lr": lr, "elapsed_ms": elapsed}
    else:
        res = predict_text(text, payload.model)
        elapsed = int((time.time() - t0) * 1000)
        metrics.record(res["label"], res["score"])
        return {"text": text, "model": payload.model, "result": res, "elapsed_ms": elapsed}

@app.post("/predict-file", response_model=PredictOut)
async def predict_file(file: UploadFile = File(...), model: str = "Both"):
    if not file.filename.lower().endswith((".txt", ".eml", ".csv")):
        raise HTTPException(status_code=400, detail="Only .txt, .eml, .csv files supported.")
    content = (await file.read()).decode(errors="ignore")
    return predict(PredictIn(text=content, model=model))  # reuse logic
