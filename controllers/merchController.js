const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Merch = require('../models/merchModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadMerchPhoto = upload.single('gambar_merch');

exports.getAllMerch = catchAsync(async (req, res, next) => {
  const merch = await Merch.findAll();

  res.status(200).json({
    status: 'success',
    results: merch.length,
    data: merch,
  });
});

exports.createMerch = catchAsync(async (req, res, next) => {
  const { nama, harga, kategori, deskripsi } = req.body;
  const { file } = req;

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const merch = await Merch.create({
    nama,
    harga,
    kategori,
    deskripsi,
    gambar_merch: url,
  });

  res.status(201).json({
    status: 'success',
    data: {
      merch,
    },
  });
});

exports.updateMerch = catchAsync(async (req, res, next) => {
  const { nama, harga, kategori, deskripsi } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const merch = await Merch.findByPk(req.params.id);

  if (!merch) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  // Update the berita record with the new data
  if (nama) merch.nama = nama;
  if (harga) merch.harga = harga;
  if (kategori) merch.kategori = kategori;
  if (deskripsi) merch.deskripsi = deskripsi;

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer, merch.photo_url);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    merch.gambar_merch = uploadedFile.secure_url;
  }

  await merch.save();

  res.status(200).json({
    status: 'success',
    data: merch,
  });
});

exports.getMerch = catchAsync(async (req, res, next) => {
  const merch = await Merch.findByPk(req.params.id);

  if (!merch) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  res.status(200).json({
    status: 'success',
    data: merch,
  });
});

exports.deleteMerch = handlerFactory.deleteOne(Merch);
