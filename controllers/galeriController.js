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
  const { nama, deskripsi, gambarGaleri } = req.body;

  const galeri = await Galeri.create({
    nama,
    gambarGaleri,
    deskripsi,
  });

  res.status(201).json({
    status: 'success',
    data: {
      galeri,
    },
  });
});

exports.updateGaleri = catchAsync(async (req, res, next) => {
  const { nama, tanggal, deskripsi, gambarGaleri } = req.body;

  // Find the berita record by ID
  const galeri = await Galeri.findByPk(req.params.id);

  if (!galeri) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (nama) galeri.nama = nama;
  if (tanggal) galeri.tanggal = tanggal;
  if (deskripsi) galeri.deskripsi = deskripsi;
  if (gambarGaleri) galeri.gambarGaleri = gambarGaleri;

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
