const express = require('express')

const { body } = require('express-validator')
const router = express.Router();
const perjadinController = require('../controllers/perjadin')

router.get('/', perjadinController.getAll);

router.post('/create', [
    body('perihal').notEmpty().withMessage("Perihal tidak boleh kosong"),
    body('berangkatDari').notEmpty().withMessage("Berangkat Dari tidak boleh kosong"),
    body('lokasi').notEmpty().withMessage("Lokasi tidak boleh kosong"),
    body('tanggalBerangkat').notEmpty().withMessage("Tanggal BErangkat tidak boleh kosong"),
    body('dasarPerjadin').notEmpty().withMessage("Dasar Perjalanan Dinas tidak boleh kosong"),
    body('tanggalKembali').notEmpty().withMessage("Tanggal Kembali boleh kosong")], perjadinController.create)

module.exports = router;