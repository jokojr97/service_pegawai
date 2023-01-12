const { validationResult } = require('express-validator')
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const Pegawai = require('../models/pegawai');
// const pegawai = require('../models/pegawai');

exports.insert = async (req, res, next) => {
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
            message: "Email sudah terdaftar! coba pakai email lain",
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

    const insertPegawai = new Pegawai({
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

    insertPegawai.save()
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

exports.getAll = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItem;
    const currentPageInt = parseInt(currentPage);
    const perPageInt = parseInt(perPage);

    Pegawai.find().countDocuments()
        .then(count => {
            totalItem = count;
            return Pegawai.find().skip((currentPageInt - 1) * perPageInt).limit(perPageInt)
        })
        .then(result => {
            if (totalItem == 0) {
                res.status(400).json({
                    message: "data masih kosong",
                    data: result,
                })
            } else {
                res.status(200).json({
                    message: "Data berhasil ditampilkan",
                    data: result,
                    total_data: totalItem,
                    current_page: currentPageInt,
                    per_page: perPageInt
                })
            }
        })
        .catch(err => {
            return res.status(400).json({
                message: "invalid value",
                eror: err
            });
            next();
        })
}

exports.getById = async (req, res, next) => {
    const id = req.params.id || 0;
    if (id == 0) {
        return res.status(400).json({
            message: "invalid value id",
            data: null
        })
        next()
    }

    const data = {
        _id: id
    }
    await Pegawai.findOne(data)
        .then(result => {
            console.log("id: ", id)
            console.log("result: ", result)
            if (result) {
                return res.status(200).json({
                    message: "Data berhasil ditampilkan",
                    data: result,
                })
            } else {
                return res.status(400).json({
                    message: "data masih kosong",
                    data: null,
                })
            }
        })
        .catch(err => {
            return res.status(400).json({
                message: "invalid value",
                eror: err
            });
            next();
        })

}