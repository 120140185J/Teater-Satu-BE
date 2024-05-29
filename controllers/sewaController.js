const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Sewa = require('../models/sewaModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadSewaPhoto = upload.single('gambar_sewa');

exports.getAllSewa = catchAsync(async (req, res, next) => {
  const sewa = await Sewa.findAll();

  res.status(200).json({
    status: 'success',
    results: sewa.length,
    data: sewa,
  });
});

exports.createSewa = catchAsync(async (req, res, next) => {
  const { nama, harga, kategori } = req.body;
  const { file } = req;

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const sewa = await Sewa.create({
    nama,
    harga,
    kategori,
    gambar_sewa: url,
  });

  res.status(201).json({
    status: 'success',
    data: {
      sewa,
    },
  });
});

exports.updateSewa = catchAsync(async (req, res, next) => {
  const { nama, harga, kategori } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const sewa = await Sewa.findByPk(req.params.id);

  if (!sewa) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (nama) sewa.nama = nama;
  if (harga) sewa.harga = harga;
  if (kategori) sewa.kategori = kategori;

  if (file) {
    const uploadedFile = await fileHelper.upload(
      file.buffer,
      sewa.photo_url
    );
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    sewa.gambar_sewa = uploadedFile.secure_url;
  }

  await sewa.save();

  res.status(200).json({
    status: 'success',
    data: sewa,
  });
});

exports.getSewa = catchAsync(async (req, res, next) => {
  const sewa = await Sewa.findByPk(req.params.id);

  if (!sewa) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: sewa,
  });
});

exports.deleteSewa = handlerFactory.deleteOne(Sewa);
