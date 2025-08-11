const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Lpprogram = require('../models/lpprogramModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadLpprogramPhoto = upload.single('photo_url');

exports.getAllLpprogram = catchAsync(async (req, res, next) => {
  const lpprogram = await Lpprogram.findAll({
  });

  res.status(200).json({
    status: 'success',
    results: lpprogram.length,
    data: lpprogram,
  });
});

exports.createLpprogram = catchAsync(async (req, res, next) => {
  const { judul, deskripsi} = req.body;
  const { file } = req;

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const lpprogram = await Lpprogram.create({
    judul,
    deskripsi,
    photo_url: url,
  });

  res.status(201).json({
    status: 'success',
    data: {
      lpprogram,
    },
  });
});

exports.updateLpprogram = catchAsync(async (req, res, next) => {
  const { judul, deskripsi} = req.body;
  const { file } = req;

  // Find the berita record by ID
  const lpprogram = await Lpprogram.findByPk(req.params.id);

  if (!lpprogram) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  // Update the berita record with the new data
  if (judul) lpprogram.judul = judul;
  if (deskripsi) lpprogram.deskripsi = deskripsi;
  
  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer, lpprogram.photo_url);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    lpprogram.photo_url = uploadedFile.secure_url;
  }

  await lpprogram.save();

  res.status(200).json({
    status: 'success',
    data: lpprogram,
  });
});

exports.getLpprogram = catchAsync(async (req, res, next) => {
  const lpprogram = await Lpprogram.findByPk(req.params.id, {
  });

  if (!lpprogram) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  res.status(200).json({
    status: 'success',
    data: lpprogram,
  });
});

exports.deleteLpprogram = handlerFactory.deleteOne(Lpprogram);
