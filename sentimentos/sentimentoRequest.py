from pydantic import BaseModel
class SentimentoRequest(BaseModel):
    prompt: str