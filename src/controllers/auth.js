const { validationResult } = require('express-validator')
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const Pegawai = require('../models/pegawai');
// const pegawai = require('../models/pegawai');

exports.register = async (req, res, next) => {
    // inisiasi error validasi
    const errors = validationResult(req);

    const data = {
        email: req.body.email
    }
    //cek email pegawai sudah terdaftar
    const cariPegawai = await Pegawai.findOne(data)
    // console.log(caripegawai)
    if (cariPegawai != null) {
        return res.status(400).json({
            message: "Email sudah terdaftar!",
            data: cariPegawai
        })
        next()
    }

    // cek error validasi
    if (!errors.isEmpty()) {
        const err = new Error("invalid value")
        err.errorStatus = 400;
        err.data = errors.array();
        return res.status(err.errorStatus).json({
            message: "Invalid Value!",
            data: err
        })
        next()
    }

    // definisi input
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const nip = req.body.nip;
    const instansi = req.body.instansi;
    const jabatan = req.body.jabatan;
    const bidang = req.body.bidang;
    const golongan = req.body.golongan;

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const image = "user.jpg"

    const insertUser = new Pegawai({
        name: name,
        email: email,
        password: hashedPassword,
        nip: nip,
        instansi: instansi,
        jabatan: jabatan,
        bidang: bidang,
        golongan: golongan,
        image: image,
        level: {
            id: 1,
            level: "admin"
        },
    });

    insertUser.save()
        .then(result => {
            res.status(201).json({
                message: "Register Success",
                data: result
            });
        }).catch(err => {
            console.log("err: ", err);
            res.status(400).json({
                message: "invalid value",
                eror: err
            });
        });
}

exports.login = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new Error("invalid value")
        err.errorStatus = 400;
        err.data = errors.array();
        return res.status(err.errorStatus).json({
            message: "Invalid Value!",
            data: err
        })
        next()
    }

    const email = req.body.email;
    const password = req.body.password;

    const data = {
        email: email
    }
    Pegawai.findOne(data).then(async (result) => {
        const comparePass = await bcrypt.compare(password, result.password);
        if (comparePass == true) {
            res.status(200).json({
                message: "Login Success!",
                status: "login",
                data: result
            })
        } else {
            res.status(404).json({
                message: "Email dan Password Tidak Sesuai!",
                data: null
            })
        }
    }).catch(err => {
        res.status(404).json({
            message: "User " + data.email + " Tidak Ditemukan!",
            data: null
        })
        // console.log(err);
        next();
    })
}