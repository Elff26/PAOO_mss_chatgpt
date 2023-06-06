require('dotenv').config()
const express = require('express')
const axios = require('axios')
const {v4: uuidv4} = require('uuid')
const app = express()
app.use(express.json())

const observacoesPorLembreId = {}
const funcoes = {
  ObservacaoClassificada: (observacao) => {
    const observacoes = observacoesPorLembreId[observacao.lembreteId]
    const obsParaAtualizar = observacoes.find(obs => obs.id === observacao.id)
    obsParaAtualizar.status = observacao.status

    axios.post('http://localhost:10000/eventos', {
      tipo:  "ObservacaoCategorizada",
      dados: {
        id: observacao.id,
        texto: observacao.texto,
        lembreteId: observacao.lembreteId,
        status: observacao.status,
        sentimento: observacao.sentimento
      }
    })
  },
  ObservacaoAnalisada: (observacao) => {
    const observacoes = observacoesPorLembreId[observacao.lembreteId]
    const obsParaAtualizar = observacoes.find(obs => obs.id === observacao.id)
    obsParaAtualizar.status = observacao.status
    obsParaAtualizar.sentimento = observacao.sentimento

    axios.post('http://localhost:10000/eventos', {
      tipo:  "ObservacaoAtualizada",
      dados: {
        id: observacao.id,
        texto: observacao.texto,
        lembreteId: observacao.lembreteId,
        status: observacao.status,
        sentimento: observacao.sentimento
      }
    })
  }
}

app.get('/lembretes/:id/observacoes', (request, response) => {
   response.send(observacoesPorLembreId[request.params.id] || [])
})

//id: é um placeholder
//exemplo: /lembretes/1234/observacoes
app.post('/lembretes/:id/observacoes', async (request, response) =>{
  //gerar um id de observação
  const idObs = uuidv4()
  //pegar o texto da observacao {texto: comprar o pó}
  const { texto } = request.body
  const observacoesDoLembrete = observacoesPorLembreId[request.params.id] || []
  observacoesDoLembrete.push({id: idObs, texto, status: 'Aguardando', sentimento: "Aguardando"})
  observacoesPorLembreId[request.params.id] = observacoesDoLembrete
  await axios.post('http://localhost:10000/eventos',
  {
    tipo: 'ObservacaoCriada',
    dados: {
      id: idObs, 
      texto, 
      lembreteId: request.params.id,
      status: 'Aguardando',
      sentimento: "Aguardando"
    }
  }
  )
  response.status(201).send(observacoesDoLembrete)
})

app.post('/eventos', (request, response)=>{
  try{
    funcoes[request.body.tipo](request.body.dados)
  }catch(e){}
  response.status(200).send({msg: 'ok'})
})

const {MSS_OBSERVACOES_PORTA} = process.env
app.listen(MSS_OBSERVACOES_PORTA, ()=>{
    console.log(`Observações. Porta ${MSS_OBSERVACOES_PORTA}`)
})