import openai
import requests
from eventoRequest import EventoRequest, Dados, DadosObservacao
import json

def encontrar_sentimento(api_key, frase):
    openai.api_key = api_key
    pergunta_padrao = "Qual sentimento da seguinte frase? Responda com apenas uma palavra: Positivo, Negativo ou Neutro. Eis a frase: "
    prompt = f'{pergunta_padrao}{frase}'

    response = openai.Completion.create(
        model='text-davinci-003',
        prompt=prompt
    )

    return response.choices[0].text.strip()


def traduzir_evento(evento_id, evento_texto, tipo, evento_status, evento_lembreteId, api_key):
    funcoes = {
        "LembreteCriado": lambda jsonLembrete: requests.post("http://localhost:10000/eventos", json=jsonLembrete),
        "ObservacaoCategorizada": lambda jsonObservacao : requests.post("http://localhost:10000/eventos", json=jsonObservacao)
    }

    try:
        if tipo == "LembreteCriado":
            sentimento_encontrado = encontrar_sentimento(api_key, evento_texto)

            evento = EventoRequest(
                tipo='LembreteAnalisado',
                dados=Dados(id=evento_id, texto=evento_texto, sentimento=sentimento_encontrado)
            )
            json_string = evento.json()
            json_object = json.loads(json_string)
            request = funcoes[tipo](json_object)

            return request.json()
        
        elif tipo == "ObservacaoCategorizada":
            sentimento_encontrado = encontrar_sentimento(api_key, evento_texto)
            
            evento = EventoRequest(
                tipo='ObservacaoAnalisada',
                dados=DadosObservacao(id=evento_id, texto=evento_texto, sentimento=sentimento_encontrado, status=evento_status, lembreteId=evento_lembreteId)
            )
            json_string = evento.json()
            json_object = json.loads(json_string)
            request = funcoes[tipo](json_object)

            return request.json()
    except:
        pass
