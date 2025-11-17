const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const { promisify } = require('util');
const { CreateAsync } = require('../utils/CreateAsync');
const jwt = require('jsonwebtoken');
const signToken = ({ _id, tokenVersion }) => {
  return jwt.sign({ _id, version: tokenVersion }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

exports.signup = CreateAsync(async (req, res) => {
  const payload = req.body;
  const newUser = await User.create({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    confirmPassword: payload.confirmPassword
  })
  res.status(201).json({
    status: "success",
    message: "User created Successfully",
    data: {
      newUser
    }
  })

})

exports.login = CreateAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Email and password are required', 400))
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || ! await user.comparePassword(password, user.password)) {
    return next(new AppError('email and password not correct', 401));
  }
  const token = signToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    domain: ".vercel.app",
    secure: process.env.NODE_ENV === 'production',
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.status(201).json({
    status: "success",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  })

})
exports.getLoginUser = CreateAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    user: req.user, // properly send user info
  });
});

exports.logout = CreateAsync(async (req, res) => {
  const userId = req.user?._id;
  await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
  res.cookie("token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0
  });
  res.json({ message: "Logged out successfully" });
})

exports.protectRouteMiddleware = CreateAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization ||
    req.headers.authorization?.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }
  if (!token) {
    return next(new AppError("Not Authorized. Please log in again.", 401));
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decoded._id);
  if (!user) {
    return next(new AppError('User no longer exists.', 401));
  }
  if (user.passwordChangedAt) {
    const passwordChangedTime = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (passwordChangedTime > decoded.iat) {
      return next(new AppError('Password recently changed. Please log in again.', 401));
    }
  }
  if (decoded.version !== user.tokenVersion) {
    return next(new AppError('Session expired. Please log in again.', 401));
  }
  req.user = user;
  next();


});
