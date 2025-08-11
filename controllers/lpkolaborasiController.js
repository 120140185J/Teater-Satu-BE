const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Lpkolaborasi = require('../models/lpkolaborasiModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadLpkolaborasiPhoto = upload.single('photo_url');

exports.getAllLpkolaborasi = catchAsync(async (req, res, next) => {
  const lpkolaborasi = await Lpkolaborasi.findAll({
  });

  res.status(200).json({
    status: 'success',
    results: lpkolaborasi.length,
    data: lpkolaborasi,
  });
});

exports.createLpkolaborasi = catchAsync(async (req, res, next) => {
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

  const lpkolaborasi = await Lpkolaborasi.create({
    judul,
    deskripsi,
    photo_url: url,
  });

  res.status(201).json({
    status: 'success',
    data: {
      lpkolaborasi,
    },
  });
});

exports.updateLpkolaborasi = catchAsync(async (req, res, next) => {
  const { judul, deskripsi} = req.body;
  const { file } = req;

  // Find the berita record by ID
  const lpkolaborasi = await Lpkolaborasi.findByPk(req.params.id);

  if (!lpkolaborasi) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  // Update the berita record with the new data
  if (judul) lpkolaborasi.judul = judul;
  if (deskripsi) lpkolaborasi.deskripsi = deskripsi;
  
  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer, lpkolaborasi.photo_url);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    lpkolaborasi.photo_url = uploadedFile.secure_url;
  }

  await lpkolaborasi.save();

  res.status(200).json({
    status: 'success',
    data: lpkolaborasi,
  });
});

exports.getLpkolaborasi = catchAsync(async (req, res, next) => {
  const lpkolaborasi = await Lpkolaborasi.findByPk(req.params.id, {
  });

  if (!lpkolaborasi) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  res.status(200).json({
    status: 'success',
    data: lpkolaborasi,
  });
});

exports.deleteLpkolaborasi = handlerFactory.deleteOne(Lpkolaborasi);
