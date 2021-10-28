// importando servidor web express
const express = require('express')
// para implementação de web services
const restful = require('node-restful')
// start server express
const server = express()
const mongoose = restful.mongoose
const bodyParser = require('body-parser')
// acessar o backend pelo frontend
const cors = require('cors')


// Database
// associando a api de promisses do node e associando ao mongoose
// api do mongoose depreciada
mongoose.Promise = global.Promise
// db será o nome do servidor criado no compose do docker

mongoose.connect('mongodb://db/mydb')

// Middlewares
server.use(bodyParser.urlencoded({extended:true}))
server.use(bodyParser.json())
server.use(cors())

// ODM
const Client = restful.model('Client', {
    name:{type: String, required: true}
})

// Rest API
Client.methods(['get','post','put','delete'])
Client.updateOptions({new:true, runValidators: true})

// Router
Client.register(server,'/clients')

server.get('/', (req, res, next) => res.send('Backend'))

//start server
server.listen(3000)