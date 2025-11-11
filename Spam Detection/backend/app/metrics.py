# app/metrics.py
from typing import Dict

_totals = {
    "scans": 0,
    "spam": 0,
    "ham": 0,
    "avg_confidence": 0.0
}

# Set these from your Assignment-2 evaluation if you like
_comparison = {
    "labels": ["Accuracy", "Precision", "Recall", "F1 Score"],
    "nb": [0.96, 0.91, 0.90, 0.90],
    "lr": [0.95, 0.94, 0.91, 0.93]
}

_confusion = {
    "labels": ["True Positive", "False Positive", "True Negative", "False Negative"],
    "nb": [850, 60, 900, 140],
    "lr": [820, 40, 920, 180]
}

def record(pred_label: str, conf: float):
    global _totals
    _totals["scans"] += 1
    if pred_label == "spam":
        _totals["spam"] += 1
    else:
        _totals["ham"] += 1
    # incremental mean
    n = _totals["scans"]
    _totals["avg_confidence"] = ((_totals["avg_confidence"] * (n - 1)) + (conf * 100.0)) / n

def snapshot() -> Dict:
    return {
        "totals": _totals,
        "comparison": _comparison,
        "confusion": _confusion
    }
