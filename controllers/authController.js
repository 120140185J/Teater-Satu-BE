// Fungsi kirim email lupa password
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendEmail } = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // 1. Cek apakah user ada
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError('No user found with that email', 404));
  }

  // 2. Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log('🔐 Reset Token (raw to send via email):', resetToken);
  console.log('🧂 Hashed Token (stored in DB):', hashedToken);

  // 3. Simpan token & waktu kedaluwarsa ke database
  user.password_reset_token = hashedToken;
  user.password_reset_expires = new Date(Date.now() + 10 * 60 * 1000); // 10 menit
  await user.save();

  // 4. Buat reset URL (gunakan backtick)
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // 5. Buat isi email (string HTML, bukan JSX)
  const message = `
    <h2>Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetURL}" target="_blank">${resetURL}</a>
    <p>This link is valid for 10 minutes.</p>
  `;

  try {
    // 6. Kirim email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      html: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Reset link sent to email!',
    });
  } catch (err) {
    console.error('❌ ERROR SENDING EMAIL:', err.message);
    console.error('🧨 FULL ERROR:', err);

    // Kosongkan token jika gagal kirim
    user.password_reset_token = null;
    user.password_reset_expires = null;
    await user.save();

    return next(new AppError('Failed to send email. Try again later.', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return next(
      new AppError('Password must be at least 6 characters long.', 400)
    );
  }

  // 1. Hash the token from params
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // 2. Find user with matching token and token not expired
  const user = await User.findOne({
    where: {
      password_reset_token: hashedToken,
      password_reset_expires: {
        [Op.gt]: new Date(),
      },
    },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  // 3. Update password (hook beforeUpdate akan meng-hash password otomatis)
  user.password = password;
  user.password_reset_token = null;
  user.password_reset_expires = null;
  await user.save();

  // 4. Generate JWT token
  const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // 5. Kirim response sukses
  res.status(200).json({
    status: 'success',
    message: 'Password successfully reset.',
    token: newToken,
  });
});
