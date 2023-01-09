const express = require('express')

const { body } = require('express-validator')
const router = express.Router();

const authController = require('../controllers/auth');

// [POST] : /v1/auth/create
// router.post('/create', [
//     body('email').isEmail().withMessage("Format Email Tidak Sesuai"),
//     body('password').isLength({ min: 5 }).withMessage("Password tidak sesuai minimal 5 karakter")],
//     authController.createUser);


// [POST] : /v1/auth/register
router.post('/register', [
    body('name').notEmpty().withMessage("Nama tidak boleh kosong"),
    body('email').isEmail().withMessage("Format Email Tidak Sesuai"),
    body('repeatPassword').custom((value, { req }) => value === req.body.password).withMessage("Ulangi Password harus sama dengan password!"),
    body('nip').notEmpty().withMessage("nip tidak boleh kosong"),
    body('instansi').notEmpty().withMessage("Instansi tidak boleh kosong"),
    body('jabatan').notEmpty().withMessage("Jabatan tidak boleh kosong"),
    body('bidang').notEmpty().withMessage("Bidang tidak boleh kosong"),
    body('golongan').notEmpty().withMessage("Golongan tidak boleh kosong"),
    body('password').isLength({ min: 5 }).withMessage("Password tidak sesuai minimal 5 karakter")],
    authController.register);


// [POST] : /v1/auth/login
router.post('/login', [
    body('email').notEmpty().withMessage("email tidak boleh kosong").isEmail().withMessage("Format Email Tidak Sesuai"),
    body('password').isLength({ min: 5 }).withMessage("Password tidak sesuai minimal 5 karakter")],
    authController.login);

module.exports = router;