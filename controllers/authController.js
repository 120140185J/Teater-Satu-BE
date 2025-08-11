const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendEmail } = require('../utils/sendEmail');

/**
 * Membuat token JWT berdasarkan user ID.
 * @param {string} id - ID dari user.
 * @returns {string} - Token JWT.
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

/**
 * Mengirim token yang sudah dibuat sebagai respons JSON.
 * @param {object} user - Objek user dari Sequelize.
 * @param {number} statusCode - Kode status HTTP.
 * @param {object} res - Objek respons dari Express.
 */
const createSendToken = (user, statusCode, res) => {
  // [PERBAIKAN] Menggunakan user.id (dari Sequelize), bukan user._id.
  const token = signToken(user.id);

  // Menghapus field password dari objek user sebelum dikirim.
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// --- FUNGSI EKSPOR UNTUK ROUTES ---

/**
 * Registrasi user baru.
 */
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
  });
  createSendToken(newUser, 201, res);
});

/**
 * Login user.
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Mohon masukkan email dan password Anda.', 400));
  }

  const user = await User.findOne({ where: { email } });

  // Pastikan method matchPassword di model Anda bisa menangani perbandingan ini.
  if (!user || !(await user.matchPassword(password, user.password))) {
    return next(new AppError('Password atau email Anda salah.', 401));
  }

  createSendToken(user, 200, res);
});

/**
 * Middleware untuk melindungi route, hanya untuk user yang terotentikasi.
 */
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1. Ambil token dari Authorization header.
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

  // 2. Verifikasi token.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Cek apakah user dari token tersebut masih ada.
  // [PERBAIKAN] Menggunakan findByPk (dari Sequelize), bukan findById.
  const currentUser = await User.findByPk(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('User yang memiliki token ini sudah tidak ada lagi.', 401)
    );
  }

  // 4. (Opsional) Cek jika user mengubah password setelah token dibuat.
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(new AppError('User baru saja mengganti password! Silakan login kembali.', 401));
  // }

  // Berikan akses dan simpan data user di request.
  req.user = currentUser;
  next();
});

/**
 * Middleware untuk membatasi akses berdasarkan role.
 * @param  {...string} roles - Daftar role yang diizinkan ('admin', 'user', dll).
 */
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Anda tidak memiliki izin untuk melakukan aksi ini.', 403)
      );
    }
    next();
  };

/**
 * Logika untuk lupa password.
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError('Tidak ada pengguna dengan email tersebut.', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validate: false }); // Simpan token dan expires ke DB

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Lupa password Anda? Kirim permintaan PATCH dengan password baru Anda ke: ${resetURL}.\nJika Anda tidak lupa password, abaikan email ini!`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Link Reset Password Anda (Berlaku 10 Menit)',
      text: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token telah dikirim ke email!',
    });
  } catch (err) {
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;
    await user.save({ validate: false });

    return next(
      new AppError('Gagal mengirim email. Silakan coba lagi nanti.', 500)
    );
  }
});

/**
 * Logika untuk reset password.
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    where: {
      password_reset_token: hashedToken,
      password_reset_expires: { [Op.gt]: Date.now() },
    },
  });

  if (!user) {
    return next(new AppError('Token tidak valid atau sudah kadaluarsa.', 400));
  }

  user.password = req.body.password;
  // Di model Anda, pastikan ada hook 'beforeSave' untuk hash password baru.
  user.password_reset_token = undefined;
  user.password_reset_expires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});
