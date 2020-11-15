const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./keys')

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
})
mongoose.connection.on('connected',()=>{
    console.log("connected to Mongo Yeahhh!!!")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})

require('./models/user-model')
require('./models/post-model')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.listen(PORT,()=>{
    console.log("Server is running on",PORT)
})
