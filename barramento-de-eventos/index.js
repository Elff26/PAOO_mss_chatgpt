require('dotenv').config()
const express = require('express')
//para enviar eventos para os demais microsserviços
const axios = require('axios')
const app = express()
app.use(express.json())

const {BARRAMENTOS_PORTA} = process.env

app.post('/eventos', (request, response)=>{
    //{tipo: lembreteCriado, payload: {id: 1, texto: "Fazer café"}}
    const evento = request.body

    try{
        //direcionando o evento para o microsserviço de lembretes
        axios.post('http://localhost:4000/eventos', evento)

        //direcionando o evento para o microsserviço de observações
        axios.post('http://localhost:5000/eventos', evento)

        //direcionando o evento para o mss de consulta
        axios.post('http://localhost:6000/eventos', evento)

        //direcionando o evento para o mss de classificação
        axios.post('http://localhost:7000/eventos', evento)

        //direcionando o evento para o mss de sentimentos
        axios.post('http://127.0.0.1:8080/eventos', evento)
    }catch(e){}
    response.status(200).send({msg: "ok"})
})

app.listen(BARRAMENTOS_PORTA, ()=>{
    console.log(`Barramento de eventos. Porta ${BARRAMENTOS_PORTA}`)
})