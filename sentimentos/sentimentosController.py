from fastapi import FastAPI
from sentimentoRequest import SentimentoRequest
from eventoRequest import EventoRequest
import sentimentosService

def criar_endpoints(OPENAI_API_KEY):
    app = FastAPI()

    @app.get('/')
    async def root():
        return {'message': 'Hello FastAPI'}
    
    @app.post('/sentimentos')
    async def obter_sentimentos(request: SentimentoRequest):
        return sentimentosService.encontrar_sentimento(
            OPENAI_API_KEY,
            request.prompt
        ) 

    @app.post('/eventos')
    async def obter_eventos(request: EventoRequest):
        if request.tipo == "LembreteCriado":
            return sentimentosService.traduzir_evento(
                request.dados.id,
                request.dados.texto,
                request.tipo,
                None,
                None,
                OPENAI_API_KEY
            )
        elif request.tipo == "ObservacaoCategorizada":
             return sentimentosService.traduzir_evento(
                request.dados.id,
                request.dados.texto,
                request.tipo,
                request.dados.status,
                request.dados.lembreteId,
                OPENAI_API_KEY
            )
    return app


