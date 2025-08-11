const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Lpgaleri = require('../models/lpgaleriModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

exports.getAllLpgaleri = catchAsync(async (req, res, next) => {
  const lpgaleri = await Lpgaleri.findAll();

  res.status(200).json({
    status: 'success',
    results: lpgaleri.length,
    data: lpgaleri,
  });
});

exports.createLpgaleri = catchAsync(async (req, res, next) => {
  const lpgaleri = await Lpgaleri.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      lpgaleri,
    },
  });
});

exports.updateLpgaleri = catchAsync(async (req, res, next) => {
  // Find the berita record by ID
  const lpgaleri = await Lpgaleri.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!lpgaleri) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  // Update the berita record with the new data
  await lpgaleri.update(req.body);

  res.status(200).json({
    status: 'success',
    data: lpgaleri,
  });
});

exports.getLpgaleri = catchAsync(async (req, res, next) => {
  const lpgaleri = await Lpgaleri.findByPk(req.params.id);

  if (!lpgaleri) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  res.status(200).json({
    status: 'success',
    data: lpgaleri,
  });
});

exports.deleteLpgaleri = handlerFactory.deleteOne(Lpgaleri);
