const express = require('express');
const { protectRouteMiddleware } = require('../controllers/authController');
const { createPost, resizeImage, getAllBlogs, updatePost, deletePost, getPostBySlug, getPostByUser } = require('../controllers/postController');
const { uploadProductImages } = require('../utils/uploadCloudinar');
const postRouter = express.Router();

postRouter.route('/').get(getAllBlogs).post(protectRouteMiddleware,uploadProductImages,resizeImage,createPost);
postRouter.route('/:id').put(protectRouteMiddleware,uploadProductImages,resizeImage,protectRouteMiddleware,updatePost);
postRouter.route('/user-blogs').get(protectRouteMiddleware,getPostByUser);
postRouter.route('/delete-multiple').delete(deletePost);
postRouter.route('/:slug').get(getPostBySlug)



module.exports = postRouter;