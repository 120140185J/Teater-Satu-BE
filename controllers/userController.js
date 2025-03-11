const multer = require('multer');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const fileHelper = require('../utils/fileHelper');

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadUserPhoto = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.'
      ),
      400
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.buffer;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateUserPhoto = catchAsync(async (req, res, next) => {
  const { file } = req;

  const user = await User.findByPk(req.params.id);

  const data = {};

  if (!user) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer, user.photo_url);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    data.photo = uploadedFile.secure_url;
  }

  await user.update(data);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  // Log untuk debugging
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  const { email, name, password, role, subscription_time } = req.body;

  // Validasi field wajib
  if (!email || !name || !password) {
    return next(new AppError('Email, name, dan password wajib diisi', 400));
  }

  // Buat objek data user
  const userData = {
    email,
    name,
    password,
    role: role || 'user',
    subscription_time: subscription_time || null,
  };

  // Tangani upload foto jika ada
  if (req.file) {
    const uploadedFile = await fileHelper.upload(req.file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Gagal mengunggah foto', 400));
    }
    userData.photo = uploadedFile.secure_url;
  }

  // Buat user baru
  const newUser = await User.create(userData);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
