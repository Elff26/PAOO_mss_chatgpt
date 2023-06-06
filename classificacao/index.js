require('dotenv').config()
const axios = require('axios')
const express = require("express")
const app = express()
app.use(express.json())

const {MSS_CLASSIFICAO_PORTA} = process.env
const palavraChave = "importante"
const funcoes = {
    ObservacaoCriada: (observacao) => {
        observacao.status = observacao.texto.includes(palavraChave) ? 'importante' : 'comum'
        axios.post("http://localhost:10000/eventos", {
            tipo: "ObservacaoClassificada",
            dados: observacao
        })
    }
}

app.post("/eventos",(request,response)=>{
    try{
        funcoes[request.body.tipo](request.body.dados)
    }catch(e){}
    response.status(200).send({msg:"okay"})
})

app.listen(MSS_CLASSIFICAO_PORTA,()=>{
    console.log(`Classificação. Porta ${MSS_CLASSIFICAO_PORTA}`)
})