require('dotenv').config()
const { default: axios } = require('axios');
const express = require('express');
const app = express()
app.use(express.json())

const baseLembretes = {}
const funcoes = {
    LembreteAnalisado: (lembrete) => {
        baseLembretes[lembrete.id] = lembrete

        axios.post('http://localhost:10000/eventos', {
            tipo:  "LembreteAtualizado",
            dados: {
              id: lembrete.id,
              texto: lembrete.texto,
              sentimento: lembrete.sentimento
            }
        })
    }
}

let idAtual = 0;

//GET localhost:4000/lembretes
app.get('/lembretes', (request, response) =>{
    response.json(baseLembretes)
})

//POST localhost:4000/lembretes
// {"texto": "Fazer café"}
app.post('/lembretes', async (request, response) =>{
    idAtual++

    //middleware simplifica a extração de conteudo 
    const {texto} = request.body
    baseLembretes[idAtual] = {
       id: idAtual, 
       texto,
       sentimento: "Aguardando"
    }

    await axios.post("http://localhost:10000/eventos", {
        tipo: "LembreteCriado",
        dados:{
            id: idAtual,
            texto,
            sentimento: "Aguardando"
        }
    })

    response.status(201).send(baseLembretes[idAtual])
})

app.post('/eventos', (request, response)=>{
    try{
        funcoes[request.body.tipo](request.body.dados)
    }catch(e){}
    response.status(200).send({msg: 'ok'})
})  

const { MSS_LEMBRETES_PORTA } = process.env
app.listen(MSS_LEMBRETES_PORTA, () =>{
   console.log(`Lembretes. Porta ${MSS_LEMBRETES_PORTA}`)
})