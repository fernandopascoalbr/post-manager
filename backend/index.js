const app = require('express')()
const consign = require('consign')
const db = require('./config/db')

const mongoose = require('mongoose')
require('./config/mongodb')

app.db = db
app.mongoose = mongoose

// consign injeta app em casa aplicação, permitindo montar os middlewares mais facilmente 
// e usar app em outros modulos
consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./schedule')
    .then('./config/routes.js')
    .into(app)

const porta = 3000
app.listen(porta, ()=>{
    console.log(`Backend rodando na porta ${porta} !!!`)
})