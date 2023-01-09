const { validationResult } = require('express-validator')
const path = require('path')
const fs = require("fs")

const Perjadin = require('../models/perjadin')

exports.create = (req, res, next) => {
    //cek error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error("Invalid Value")
        err.errorStatus = 400
        err.data = errors.array()
        throw err;
    }

    const perihal = req.body.perihal;
    const berangkatDari = req.body.berangkatDari;
    const lokasi = req.body.lokasi;
    const tanggalBerangkat = req.body.tanggalBerangkat;
    const tanggalKembali = req.body.tanggalKembali;
    const dasarPerjadin = req.body.dasarPerjadin;
    const image = req.body.image;

    const PerjalananDinas = new Perjadin({
        perihal: perihal,
        berangkatDari: berangkatDari,
        lokasi: lokasi,
        tanggalBerangkat: tanggalBerangkat,
        tanggalKembali: tanggalKembali,
        dasarPerjadin: dasarPerjadin,
        image: image,
        author: {
            uid: 1,
            name: "Jokori"
        }
    });

    PerjalananDinas.save()
        .then(result => {
            res.status(201).json({
                message: "Create Perjadin Post Success",
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
    const currentPageInt = parseInt(currentPage)
    const perPageInt = parseInt(perPage);

    Perjadin.find().countDocuments()
        .then(count => {
            totalItem = count;
            return Perjadin.find()
                .skip((currentPageInt - 1) * perPageInt)
                .limit(perPageInt)
        })
        .then(result => {
            if (totalItem == 0) {
                res.status(200).json({
                    message: "Data Masih Kosong!",
                    data: result,
                })
            } else {
                res.status(200).json({
                    message: "Data Berhasil ditampilkan!",
                    data: result,
                    total_data: totalItem,
                    current_page: currentPageInt,
                    per_page: perPageInt
                })
            }
        })
        .catch(err => {
            next(err);
        })
}
