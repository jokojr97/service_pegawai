const express = require('express')

const { body } = require('express-validator')
const router = express.Router();

const pegawaiController = require('../controllers/pegawai');

// [POST] : /v1/auth/create
// router.post('/create', [
//     body('email').isEmail().withMessage("Format Email Tidak Sesuai"),
//     body('password').isLength({ min: 5 }).withMessage("Password tidak sesuai minimal 5 karakter")],
//     pegawaiController.createUser);


// [POST] : /v1/pegawai/insert
router.post('/insert', [
    body('name').notEmpty().withMessage("Nama tidak boleh kosong"),
    body('email').isEmail().withMessage("Format Email Tidak Sesuai"),
    body('repeatPassword').custom((value, { req }) => value === req.body.password).withMessage("Ulangi Password harus sama dengan password!"),
    body('nip').notEmpty().withMessage("nip tidak boleh kosong"),
    body('instansi').notEmpty().withMessage("Instansi tidak boleh kosong"),
    body('jabatan').notEmpty().withMessage("Jabatan tidak boleh kosong"),
    body('bidang').notEmpty().withMessage("Bidang tidak boleh kosong"),
    body('golongan').notEmpty().withMessage("Golongan tidak boleh kosong"),
    body('password').isLength({ min: 5 }).withMessage("Password tidak sesuai minimal 5 karakter")],
    pegawaiController.insert);


// [PATCH] : /v1/pegawai/edit
router.patch('/update', [
    body('_id').notEmpty().withMessage("Id tidak boleh kosong"),
    body('name').notEmpty().withMessage("Nama tidak boleh kosong"),
    body('email').isEmail().withMessage("Format Email Tidak Sesuai"),
    body('repeatPassword').custom((value, { req }) => value === req.body.password).withMessage("Ulangi Password harus sama dengan password!"),
    body('nip').notEmpty().withMessage("nip tidak boleh kosong"),
    body('instansi').notEmpty().withMessage("Instansi tidak boleh kosong"),
    body('jabatan').notEmpty().withMessage("Jabatan tidak boleh kosong"),
    body('bidang').notEmpty().withMessage("Bidang tidak boleh kosong"),
    body('golongan').notEmpty().withMessage("Golongan tidak boleh kosong"),
    body('password').isLength({ min: 5 }).withMessage("Password tidak sesuai minimal 5 karakter")],
    pegawaiController.update);

// [GET]: /v1/pegawai/ID
router.get('/:id', pegawaiController.getById)

// [DELETE]: /v1/pegawai/ID
router.delete('/:id', pegawaiController.delete)

// [GET]: /v1/pegawai
router.get('/', pegawaiController.getAll)


module.exports = router;