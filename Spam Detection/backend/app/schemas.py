# app/schemas.py
from pydantic import BaseModel, Field
from typing import List, Literal, Optional

ModelName = Literal["MultinomialNB", "LogisticRegression", "Both"]

class PredictIn(BaseModel):
    text: str = Field(min_length=10)
    model: ModelName = "Both"

class WordWeight(BaseModel):
    word: str
    weight: float

class SinglePred(BaseModel):
    label: Literal["spam", "ham"]
    score: float
    top_words: Optional[List[WordWeight]] = None

class PredictOut(BaseModel):
    text: str
    model: ModelName
    result: Optional[SinglePred] = None  # when single model
    nb: Optional[SinglePred] = None      # when Both
    lr: Optional[SinglePred] = None
    elapsed_ms: int

class MetricsOut(BaseModel):
    totals: dict
    comparison: dict
    confusion: dict
