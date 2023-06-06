require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())

const funcoes = {
  LembreteCriado: (lembrete) => {
    baseConsulta[lembrete.id] = lembrete
  },
  LembreteAtualizado: (lembrete) => {
    baseConsulta[lembrete.id] = lembrete
  },
  ObservacaoCriada: (observacao) => {
    const observacoes = baseConsulta[observacao.lembreteId]['observacoes'] || []
    observacoes.push(observacao)
    baseConsulta[observacao.lembreteId]['observacoes'] = observacoes
  },
  ObservacaoCategorizada: (observacao) => {
    const observacoes = baseConsulta[observacao.lembreteId]["observacoes"]
    const indice = observacoes.findIndex(obs => obs.id === observacao.id)
    observacoes[indice] = observacao
  },
  ObservacaoAtualizada: (observacao) => {
    console.log(observacao)
    const observacoes = baseConsulta[observacao.lembreteId]["observacoes"]
    const indice = observacoes.findIndex(obs => obs.id === observacao.id)
    observacoes[indice] = observacao
  }
}

const baseConsulta = {}

//GET /lembretes
app.get('/lembretes', (request, response) => {
  response.send(baseConsulta)
})

//POST /eventos
app.post('/eventos', (request, response) => {
  try {
    const { tipo, dados } = request.body;
    funcoes[tipo](dados);
  } catch (e) {}

  response.status(200).send({ msg: "okay" });
});


const { MSS_CONSULTAS_PORTA } = process.env
app.listen(
    MSS_CONSULTAS_PORTA, 
    () => console.log(`Consulta. Porta ${MSS_CONSULTAS_PORTA}`)
)