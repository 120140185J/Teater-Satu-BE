const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { OAuth2Client } = require('google-auth-library'); // Tambahan

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendEmail } = require('../utils/sendEmail');

// [TAMBAHAN] Inisialisasi Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

const createSendToken = (user, statusCode, res) => {
  // [PERBAIKAN BUG] Menggunakan user.id (Sequelize) bukan user._id (Mongoose)
  const token = signToken(user.id);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

// [TAMBAHAN] Fungsi baru untuk menangani login via Google
exports.loginGoogle = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return next(new AppError('Google token tidak ditemukan', 400));
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { name, email, picture } = ticket.getPayload();

  let user = await User.findOne({ where: { email } });

  if (!user) {
    user = await User.create({
      name,
      email,
      password: crypto.randomBytes(32).toString('hex'),
      role: 'user',
      photo: picture,
    });
  }
  createSendToken(user, 200, res);
});

// --- FUNGSI-FUNGSI LAMA (TIDAK DIUBAH) ---

exports.signup = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: hashedPassword,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Mohon masukan email dan password anda', 400));
  }
  const user = await User.findOne({ where: { email: email } });
  if (!user || !(await user.matchPassword(password, user.password))) {
    return next(new AppError('Password atau email anda salah', 401));
  }
  createSendToken(user, 200, res);
});

exports.subscription = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    return next(new AppError('Mohon masukan id', 400));
  }
  const hasil = await User.findByPk(id, { attributes: ['subscription'] });
  if (!hasil) {
    return next(new AppError('User tidak ditemukan', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { subscription: hasil.dataValues.subscription },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
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
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // [PERBAIKAN BUG] Menggunakan findByPk (Sequelize) bukan findById (Mongoose)
  const currentUser = await User.findByPk(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  if (
    currentUser.changedPasswordAfter &&
    currentUser.changedPasswordAfter(decoded.iat)
  ) {
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
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError('Tidak ada pengguna dengan email tersebut.', 404));
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.password_reset_token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.password_reset_expires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validate: false });
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `<h2>Reset Password</h2><p>Klik tombol di bawah untuk mengganti password Anda:</p><a href="${resetURL}" target="_blank" style="padding: 10px 20px; background-color: #00b894; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a><p>Link ini hanya berlaku selama 15 menit.</p>`;
  try {
    await sendEmail({
      to: user.email,
      subject: 'Link Reset Password Anda (Berlaku 15 Menit)',
      html: message,
    });
    res
      .status(200)
      .json({
        status: 'success',
        message: 'Link reset password telah dikirim ke email Anda.',
      });
  } catch (err) {
    user.password_reset_token = null;
    user.password_reset_expires = null;
    await user.save({ validate: false });
    return next(
      new AppError('Gagal mengirim email. Silakan coba lagi nanti.', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password || password.length < 6) {
    return next(new AppError('Password minimal harus 6 karakter.', 400));
  }
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    where: {
      password_reset_token: hashedToken,
      password_reset_expires: { [Op.gt]: new Date() },
    },
  });
  if (!user) {
    return next(new AppError('Token tidak valid atau sudah kadaluarsa.', 400));
  }
  user.password = await bcrypt.hash(password, 12);
  user.password_reset_token = null;
  user.password_reset_expires = null;
  await user.save();
  const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
  res
    .status(200)
    .json({
      status: 'success',
      message: 'Password berhasil di-reset.',
      token: newToken,
    });
});
