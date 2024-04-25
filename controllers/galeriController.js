const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Galeri = require('../models/galeriModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadGaleriPhoto = upload.single('gambar_galeri');

exports.getAllGaleri = catchAsync(async (req, res, next) => {
  const galeri = await Galeri.findAll();

  res.status(200).json({
    status: 'success',
    results: galeri.length,
    data: galeri,
  });
});

exports.createGaleri = catchAsync(async (req, res, next) => {
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

  const galeri = await Galeri.create({
    nama,
    harga,
    kategori,
    gambar_galeri: url,
  });

  res.status(201).json({
    status: 'success',
    data: {
      galeri,
    },
  });
});

exports.updateGaleri = catchAsync(async (req, res, next) => {
  const { nama, harga, kategori } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const galeri = await Galeri.findByPk(req.params.id);

  if (!galeri) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (nama) galeri.nama = nama;
  if (harga) galeri.harga = harga;
  if (kategori) galeri.kategori = kategori;

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer, galeri.photo_url);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    galeri.gambar_Galeri = uploadedFile.secure_url;
  }

  await galeri.save();

  res.status(200).json({
    status: 'success',
    data: galeri,
  });
});

exports.getGaleri = catchAsync(async (req, res, next) => {
  const galeri = await Galeri.findByPk(req.params.id);

  if (!galeri) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: galeri,
  });
});

exports.deleteGaleri = handlerFactory.deleteOne(Galeri);
