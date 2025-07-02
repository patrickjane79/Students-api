const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    dateOfAdm: {
        type: String,
        required: true,
        default: Date.now().toString()
    }
})
module.exports = mongoose.model('Student', studentSchema)