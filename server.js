const express = require('express')
const app = express()

//import mongoose and connect to a mongoDB database
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/students')
const db = mongoose.connection
db.on('error', (err)=> console.error(err))
db.once('open', ()=> console.log("connected to db succesfully")) //fires only once, the first time the connection is ready for use

app.use(express.json())

const studentRouter = require('./routes/students.js')
app.use('/students', studentRouter)

app.listen(5000, ()=>{
    console.log("server started")
})