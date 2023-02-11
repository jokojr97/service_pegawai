const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')

const app = express();
const port = 4000;
const authRoutes = require("./src/routes/auth")
const pegawaiRoutes = require("./src/routes/pegawai")
// const portofolioRoutes = require("./src/routes/portofolio")
// const router = express.Router();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(bodyParser.json()) // type json
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    next();
})

//routes
app.use('/v1/auth', authRoutes);
app.use('/v1/pegawai', pegawaiRoutes);

app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({
        message: message,
        data: data,
    })
})

mongoose.connect('mongodb+srv://jokoriy:IF4G7vEG7fnE7Cu9@cluster0.2izfxze.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        app.listen(port, () => console.log('connection success'))
    })
    .catch(err => console.log(err))

// app.listen(port);