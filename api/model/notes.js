const path = require('path')
const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
    // Описываем модель Page. То есть из чего состоит динамическая страница сайта.

    name: {
        // Например, адрес страницы является строкой. Он обязателен и должен быть уникальным.
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: false
    },
    picker: {},
    time: {
        type: String,
        required: true,
        unique: false
    },
    createdDate: {
        // У каждой страницы автоматически сохраняется дата создания.
        type: Date,
        default: Date.now
    }
})



module.exports = mongoose.model('Notes', notesSchema)