const express = require('express');
const { signup, login, protectRouteMiddleware, getLoginUser, logout } = require('../controllers/authController');
const authRouter = express.Router();

authRouter.route('/register').post(signup);
authRouter.route('/login').post(login);
authRouter.route('/me').get(protectRouteMiddleware,getLoginUser)
authRouter.route('/logout').post(logout)




module.exports = authRouter;