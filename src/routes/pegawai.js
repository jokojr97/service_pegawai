const express = require('express')
const multer = require('multer')
const XLSX = require('xlsx')
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
    body('repeatPassword').custom((value, { req }) => value === req.body.password).withMessage("Ulangi Password harus sama dengan password!").isLength({ min: 5 }).withMessage("Password tidak sesuai minimal 5 karakter"),
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

router.patch('/update/nonpass', [
    body('_id').notEmpty().withMessage("Id tidak boleh kosong"),
    body('name').notEmpty().withMessage("Nama tidak boleh kosong"),
    body('email').isEmail().withMessage("Format Email Tidak Sesuai"),
    body('nip').notEmpty().withMessage("nip tidak boleh kosong"),
    body('instansi').notEmpty().withMessage("Instansi tidak boleh kosong"),
    body('jabatan').notEmpty().withMessage("Jabatan tidak boleh kosong"),
    body('bidang').notEmpty().withMessage("Bidang tidak boleh kosong"),
    body('golongan').notEmpty().withMessage("Golongan tidak boleh kosong")],
    pegawaiController.update);

// [GET]: /v1/pegawai/ID
router.get('/:id', pegawaiController.getById)

// router.post('/excel/import', pegawaiController.excelImport)

//import excel
const fileStorageExcel = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'excel')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const uploadExcel = multer({ storage: fileStorageExcel });


const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName)
    }
});


const uploadpdf = multer({
    storage: storage,
    limits: { fileSize: 100000 }
}).single("excel");

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg .pdf and .jpeg  format allowed!'));
        }
    }
}).single("excel");


router.post('/excel/import', upload, (req, res, next) => {
    console.log(req.file)
    // const workbook = XLSX.readFile(req.files.path)
    // const sheet_namelist = workbook.SheetNames
    // var x = 0
    // sheet_namelist.forEach(e => {
    //     const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]])
    //     console.log(xlData)
    // })

})


// [DELETE]: /v1/pegawai/ID
router.delete('/:id', pegawaiController.delete)

// [GET]: /v1/pegawai
router.get('/', pegawaiController.getAll)


module.exports = router;