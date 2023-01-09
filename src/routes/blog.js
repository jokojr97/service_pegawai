const express = require('express');
const { body } = require('express-validator')

const router = express.Router();
const blogController = require('../controllers/blog')

// input data postingan
// [POST] : /v1/blog/post 
router.post('/post', [
    body('title').isLength({ min: 5 }).withMessage("Tittle Tidak Sesuai minimal 5 karakter"),
    body('description').isLength({ min: 5 }).withMessage("Description tidak sesuai minimal 5 karakter")],
    blogController.create);

// get all data post
// [GET] : /v1/blog/posts 
router.get('/posts', blogController.getAll);

// get data post by postId
// [GET] : /v1/blog/post/postId 
router.get('/post/:postId', blogController.getById);

// update data post
// [PUT] : /v1/blog/post/postId 
router.put('/post/:postId', [
    body('title').isLength({ min: 5 }).withMessage("Tittle Tidak Sesuai minimal 5 karakter"),
    body('description').isLength({ min: 5 }).withMessage("Description tidak sesuai minimal 5 karakter")],
    blogController.updateBlogPost);

// delete data post 
// [delete] : /v1/blog/post/postId
router.delete('/post/:postId', blogController.deleteBlogPost)

module.exports = router;