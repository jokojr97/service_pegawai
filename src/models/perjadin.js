const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Perjadin = new Schema({

    perihal: {
        type: String,
        require: true
    },
    berangkatDari: {
        type: String,
        require: true
    },
    lokasi: {
        type: String,
        require: true
    },
    tanggalBerangkat: {
        type: Date,
        require: true
    },
    tanggalKembali: {
        type: Date,
        require: true
    },
    dasarPerjadin: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: false
    },
    author: {
        type: Object,
        require: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Perjadin', Perjadin)