const { validationResult } = require('express-validator')
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const Pegawai = require('../models/pegawai');
// const pegawai = require('../models/pegawai');

exports.delete = async (req, res, next) => {
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

    try {
        const pegawai = await Pegawai.findOne(data);
        await pegawai.remove();
        return res.status(200).json({
            message: "Data dengan id= " + id + " berhasil di hapus",
            data: true
        });
    } catch {
        return res.status(404).json({
            message: "data Pegawai not found",
            eror: "not found"
        });
    }
}
exports.update = async (req, res, next) => {
    const errors = validationResult(req);

    const data = {
        _id: req.body._id
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
    }

    try {
        const cariPegawai = await Pegawai.findOne(data);
        const pegawai = Object.assign(cariPegawai, req.body);

        pegawai.save().then(result => {
            res.status(200).json({
                message: "Update Data Success",
                data: result
            });
        }).catch(err => {
            console.log("err: ", err);
            res.status(400).json({
                message: "invalid value",
                eror: err
            });
        });

    } catch {
        return res.status(404).json({
            message: "data not found",
            eror: "not found"
        });
    }

}
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
    const pangkat = req.body.pangkat;
    const role = req.body.role;

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
        pangkat: pangkat,
        level: role,
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

const getsort = (sort, sortvalue) => {
    if (sort == "name") {
        return { name: sortvalue }
    } else if (sort == "instansi") {
        return { instansi: sortvalue }
    } else if (sort == "bidang") {
        return { bidang: sortvalue }
    } else if (sort == "jabatan") {
        return { jabatan: sortvalue }
    } else if (sort == "golongan") {
        return { golongan: sortvalue }
    }
}

exports.getAll = (req, res, next) => {
    const search = req.query.search || '';
    const sort = req.query.sort || 'createdAt';
    const sortval = req.query.sortval || 'desc';
    const srt = getsort(sort, sortval)
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItem;
    const currentPageInt = parseInt(currentPage);
    const perPageInt = parseInt(perPage);

    Pegawai.find({ name: { $regex: '.*' + search + '.*' } }).sort(srt).countDocuments()
        .then(count => {
            totalItem = count;
            return Pegawai.find({ name: { $regex: '.*' + search + '.*' } }).sort(srt).skip((currentPageInt - 1) * perPageInt).limit(perPageInt)
        })
        .then(result => {
            if (totalItem == 0) {
                res.status(400).json({
                    message: "data tidak ditemukan",
                    data: result
                })
            } else {
                res.status(200).json({
                    message: "Data berhasil ditampilkan",
                    data: result,
                    total_data: totalItem,
                    current_page: currentPageInt,
                    per_page: perPageInt,
                    search: search
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
            // console.log("id: ", id)
            // console.log("result: ", result)
            if (result) {
                return res.status(200).json({
                    message: "Data berhasil ditampilkan",
                    data: result,
                })
            } else {
                return res.status(400).json({
                    message: "data not found",
                    data: null,
                })
            }
        })
        .catch(err => {
            return res.status(404).json({
                message: "data with id = '" + err.value + "' not found",
                eror: err
            });
            next();
        })

}
