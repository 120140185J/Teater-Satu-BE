/* eslint-disable camelcase */
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Mohon masukan email dan password anda', 400));
  }

  const user = await User.findOne({ where: { email: email } });
  console.log(user.password);
  console.log(password);
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Password atau email anda salah', 401));
  }

  createSendToken(user, 200, res);
});

exports.subscription = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new AppError('Mohon masukan id', 400));
  }

  const hasil = await User.findByPk(id, {
    attributes: ['subscription'],
  });

  if (!hasil) {
    return next(new AppError('User tidak ditemukan', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      subscription: hasil.dataValues.subscription,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user exist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! please log in again.', 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // if token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // update changedPasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Pastikan password lama, id, dan password baru ada di request body
  const { id, password_current, password } = req.body;

  if (!id || !password_current || !password) {
    return next(new AppError('Please provide all required fields.', 400));
  }

  // Cari user berdasarkan ID dan masukkan kolom password
  const user = await User.findByPk(id, {
    attributes: ['id', 'password'], // Pastikan kolom password diambil secara eksplisit
  });

  // Validasi apakah user ditemukan
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  // Periksa apakah password lama cocok
  const isPasswordCorrect = await user.matchPassword(
    password_current,
    user.password
  );
  if (!isPasswordCorrect) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // Perbarui password bcrypt
  const DEFAULT_SALT_ROUNDS = 10;
  const encryptedPassword = await bcrypt.hash(
    user.password,
    DEFAULT_SALT_ROUNDS
  );
  user.password = encryptedPassword;

  // Simpan user
  await user.save();

  // Kirim token JWT ke user
  createSendToken(user, 200, res);
});
