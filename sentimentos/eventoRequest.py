from pydantic import BaseModel
class Dados(BaseModel):
    id: int 
    texto: str
    sentimento: str

class DadosObservacao(BaseModel):
    id: str
    lembreteId : int
    texto: str
    sentimento: str
    status: str

class EventoRequest(BaseModel):
    tipo: str
    dados: Dados | DadosObservacao

