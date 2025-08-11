const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Lpberita = require('../models/lpberitaModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadLpberitaPhoto = upload.single('photo_url');

exports.getAllLpberita = catchAsync(async (req, res, next) => {
  const lpberita = await Lpberita.findAll({
  });

  res.status(200).json({
    status: 'success',
    results: lpberita.length,
    data: lpberita,
  });
});

exports.createLpberita = catchAsync(async (req, res, next) => {
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

  const lpberita = await Lpberita.create({
    judul,
    deskripsi,
    photo_url: url,
  });

  res.status(201).json({
    status: 'success',
    data: {
      lpberita,
    },
  });
});

exports.updateLpberita = catchAsync(async (req, res, next) => {
  const { judul, deskripsi} = req.body;
  const { file } = req;

  // Find the berita record by ID
  const lpberita = await Lpberita.findByPk(req.params.id);

  if (!lpberita) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  // Update the berita record with the new data
  if (judul) lpberita.judul = judul;
  if (deskripsi) lpberita.deskripsi = deskripsi;
  
  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer, lpberita.photo_url);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    lpberita.photo_url = uploadedFile.secure_url;
  }

  await lpberita.save();

  res.status(200).json({
    status: 'success',
    data: lpberita,
  });
});

exports.getLpberita = catchAsync(async (req, res, next) => {
  const lpberita = await Lpberita.findByPk(req.params.id, {
  });

  if (!lpberita) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  res.status(200).json({
    status: 'success',
    data: lpberita,
  });
});

exports.deleteLpberita = handlerFactory.deleteOne(Lpberita);
