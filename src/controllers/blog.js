const { validationResult } = require('express-validator')
const path = require('path');
const fs = require('fs');

const BlogPost = require('../models/blog');

exports.create = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new Error("invalid value")
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    if (!req.file) {
        const err = new Error("image Harus di isi")
        err.errorStatus = 422;
        throw err;
    }

    const title = req.body.title;
    const image = req.file.path;
    const description = req.body.description;

    const Posting = new BlogPost({
        title: title,
        description: description,
        image: image,
        author: { uid: 1, name: "Jokori" }
    });

    Posting.save()
        .then(result => {
            res.status(201).json({
                message: "Create Blog Post Success",
                data: result
            });
        }).catch(err => {
            console.log("err: ", err);
        });

}

exports.getAll = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItem;

    const currentPageInt = parseInt(currentPage)
    const perPageInt = parseInt(perPage);

    BlogPost.find().countDocuments()
        .then(count => {
            totalItem = count;
            return BlogPost.find()
                .skip((currentPageInt - 1) * perPageInt)
                .limit(perPageInt)
        })
        .then(result => {
            res.status(200).json({
                message: "Data Berhasil ditampilkan!",
                data: result,
                total_data: totalItem,
                current_page: currentPageInt,
                per_page: perPageInt
            })
        })
        .catch(err => {
            next(err);
        })
}

exports.getById = (req, res, next) => {
    const postId = req.params.postId;
    BlogPost.findById(postId).then(result => {
        if (!result) {
            const error = new Error("Postingan tidak ditemukan");
            error.errorStatus = 404;
            throw error;
        }
        res.status(200).json({
            message: "Data Berhasil ditampilkan!",
            data: result
        })
    }).catch(err => {
        next(err);
    });

}


exports.updateBlogPost = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new Error("invalid value")
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    if (!req.file) {
        const err = new Error("image Harus di isi")
        err.errorStatus = 422;
        throw err;
    }

    const title = req.body.title;
    const image = req.file.path;
    const description = req.body.description;

    const postId = req.params.postId;
    BlogPost.findById(postId).then(post => {
        if (!post) {
            const error = new Error("Postingan tidak ditemukan");
            error.errorStatus = 404;
            throw error;
        }

        post.title = title;
        post.description = description;
        post.image = image;

        return post.save();

    }).then(result => {
        res.status(201).json({
            message: "Update Blog Post Success",
            data: result
        });
    }).catch(err => {
        next(err);
    });

}

exports.deleteBlogPost = (req, res, next) => {
    const postId = req.params.postId;
    BlogPost.findById(postId)
        .then(result => {
            if (!result) {
                const error = new Error("Postingan tidak ditemukan");
                error.errorStatus = 404;
                throw error;
            }

            removeImage(result.image);
            return BlogPost.findByIdAndRemove(postId)

        })
        .then(result => {
            res.status(200).json({
                message: "Data Berhasil dihapus!",
                data: result
            })
        })
        .catch(err => {
            next(err);
        });
}

const removeImage = (filePath) => {
    const dirPath = path.join(__dirname, '../..', filePath);
    // console.log(dirPath);
    fs.unlink(dirPath, err => console.log(err));

}
