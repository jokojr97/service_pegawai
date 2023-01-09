const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Pegawai = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    nip: {
        type: String,
        require: true
    },
    instansi: {
        type: String,
        require: true
    },
    jabatan: {
        type: String,
        require: true
    },
    bidang: {
        type: String,
        require: true
    },
    golongan: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    level: {
        type: Object,
        require: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pegawai', Pegawai)