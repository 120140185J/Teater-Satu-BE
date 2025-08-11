const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Galeri = require('../models/galeriModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

exports.getAllGaleri = catchAsync(async (req, res, next) => {
  const galeri = await Galeri.findAll();

  res.status(200).json({
    status: 'success',
    results: galeri.length,
    data: galeri,
  });
});

exports.createGaleri = catchAsync(async (req, res, next) => {
  const {
    judul,
    karya,
    gambarGaleri,
    gambarthumbnail,
    deskripsi,
    gambarGaleri2,
  } = req.body;

  const galeri = await Galeri.create({
    judul,
    karya,
    gambarGaleri,
    gambarthumbnail,
    deskripsi,
    gambarGaleri2,
  });

  res.status(201).json({
    status: 'success',
    data: {
      galeri,
    },
  });
});

exports.updateGaleri = catchAsync(async (req, res, next) => {
  const {
    judul,
    karya,
    gambarGaleri,
    gambarthumbnail,
    deskripsi,
    gambarGaleri2,
  } = req.body;

  // Find the berita record by ID
  const galeri = await Galeri.findByPk(req.params.id);

  if (!galeri) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  // Update the berita record with the new data
  if (judul) galeri.judul = judul;
  if (karya) galeri.karya = karya;
  if (gambarGaleri) galeri.gambarGaleri = gambarGaleri;
  if (gambarthumbnail) galeri.gambarthumbnail = gambarthumbnail;
  if (deskripsi) galeri.deskripsi = deskripsi;
  if (gambarGaleri2) galeri.gambarGaleri2 = gambarGaleri2;

  await galeri.save();

  res.status(200).json({
    status: 'success',
    data: galeri,
  });
});

exports.getGaleri = catchAsync(async (req, res, next) => {
  const galeri = await Galeri.findByPk(req.params.id);

  if (!galeri) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  res.status(200).json({
    status: 'success',
    data: galeri,
  });
});

exports.deleteGaleri = handlerFactory.deleteOne(Galeri);
