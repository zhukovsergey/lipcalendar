const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.Schema.Types.Boolean.convertToFalse.add('')
const app = express()
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const Notes = require('./model/notes')
app.use(helmet())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/api', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true

})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('connected444 to database'))

app.post('/notes', async(req, res, next) => {
    console.log(req.body)
    const Note = new Notes({
        name: req.body.name,
        email: req.body.email,
        picker: req.body.picker,
        time: req.body.time
    })
    try {
        const newNote = Note.save()
        await res.status(201).json(newNote)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

app.get('/notes', async function(req, res) {
    try {
        const blogs = await Notes.find()
            .select('name email picker time')
            .sort('-createdDate')
            .lean()
            .exec()
        res.json(blogs)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


app.get('/notesdates', async function(req, res) {
    try {
        const blogs = await Notes.find({ tag: 'Национальные проекты' })
            .select('name email picker')
            .sort('-createdDate')
            .lean()
            .exec()
        res.json(blogs)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = {
    path: '/api',
    handler: app
}