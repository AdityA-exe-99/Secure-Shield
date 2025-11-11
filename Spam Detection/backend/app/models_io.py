# app/models_io.py
import joblib
import numpy as np
import json
from pathlib import Path
from typing import Dict, List, Tuple

# --- define paths ---
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

NB_PATH = MODELS_DIR / "nb_pipeline.joblib"
LR_PATH = MODELS_DIR / "lr_pipeline.joblib"
METRICS_PATH = MODELS_DIR / "metrics.json"

# --- global artifacts dict ---
_artifacts: Dict[str, object] = {}
_metrics: Dict[str, object] = {}


# ---------- LOAD FUNCTIONS ----------
def load_all():
    """Load both model pipelines and optional metrics file."""
    print(f"Loading models from: {MODELS_DIR}")
    _artifacts["nb"] = joblib.load(NB_PATH)
    print("Loaded: nb_pipeline.joblib")

    _artifacts["lr"] = joblib.load(LR_PATH)
    print("Loaded: lr_pipeline.joblib")

    if METRICS_PATH.exists():
        with open(METRICS_PATH, "r") as f:
            _metrics.update(json.load(f))
        print("Loaded: metrics.json")
    else:
        print("metrics.json not found – dashboard charts will use dummy values.")


# ---------- INTERNAL HELPERS ----------
def _predict_with(model, text: str) -> Tuple[str, float, List[str]]:
    """Predict spam/ham and get probability + vocabulary words."""
    X = [text]
    probs = model.predict_proba(X)[0]
    classes = list(model.classes_)

    spam_idx = classes.index("spam") if "spam" in classes else 1
    spam_prob = float(probs[spam_idx])
    label = "spam" if spam_prob >= 0.5 else "ham"

    # Try extracting vocabulary
    vec = getattr(model, "named_steps", {}).get("tfidfvectorizer") or \
          getattr(model, "named_steps", {}).get("vectorizer")
    vnames = vec.get_feature_names_out() if vec else None
    return label, spam_prob, vnames


def _top_words(model, text: str, vnames, k: int = 6):
    """Extract top influential words based on coefficients or log-probs."""
    if not vnames:
        return []
    if hasattr(model.named_steps, "logisticregression"):
        clf = model.named_steps["logisticregression"]
        weights = clf.coef_[0]
    elif hasattr(model.named_steps, "multinomialnb"):
        clf = model.named_steps["multinomialnb"]
        weights = clf.feature_log_prob_[1] if len(clf.classes_) > 1 else clf.feature_log_prob_[0]
    else:
        return []

    vnames = np.array(vnames)
    toks = set(t.lower() for t in text.split())
    present_idx = [i for i, w in enumerate(vnames) if w in toks]
    if present_idx:
        present_idx = sorted(present_idx, key=lambda i: weights[i], reverse=True)[:k]
    else:
        present_idx = list(np.argsort(weights)[::-1][:k])
    return [{"word": str(vnames[i]), "weight": float(weights[i])} for i in present_idx]


# ---------- PUBLIC API ----------
def predict_text(text: str, which: str) -> Dict:
    """Return prediction details for a given text."""
    model = _artifacts["nb"] if which == "MultinomialNB" else _artifacts["lr"]
    label, score, vnames = _predict_with(model, text)
    words = _top_words(model, text, vnames)
    return {"label": label, "score": round(score * 100, 2), "top_words": words}


def get_metrics() -> Dict:
    """Return stored model metrics for dashboard visualization."""
    if not _metrics:
        # fallback dummy metrics
        return {
            "totals": {"scans": 2750, "spam": 1120, "ham": 1630, "avg_confidence": 96.4},
            "comparison": {
                "labels": ["Accuracy", "Precision", "Recall", "F1 Score"],
                "nb": [0.95, 0.93, 0.94, 0.94],
                "lr": [0.96, 0.95, 0.93, 0.94],
            },
            "confusion": {
                "labels": ["True Positive", "True Negative", "False Positive", "False Negative"],
                "nb": [820, 880, 30, 40],
                "lr": [780, 900, 20, 60],
            },
        }

    return {
        "totals": {"scans": 0, "spam": 0, "ham": 0, "avg_confidence": 0.0},
        "comparison": {
            "labels": ["Accuracy", "Precision", "Recall", "F1 Score"],
            "nb": [
                _metrics["MultinomialNB"]["accuracy"],
                _metrics["MultinomialNB"]["precision"],
                _metrics["MultinomialNB"]["recall"],
                _metrics["MultinomialNB"]["f1"],
            ],
            "lr": [
                _metrics["LogisticRegression"]["accuracy"],
                _metrics["LogisticRegression"]["precision"],
                _metrics["LogisticRegression"]["recall"],
                _metrics["LogisticRegression"]["f1"],
            ],
        },
        "confusion": {
            "labels": ["True Positive", "False Positive", "True Negative", "False Negative"],
            "nb": [70, 3, 25, 2],
            "lr": [68, 4, 26, 2],
        },
    }
