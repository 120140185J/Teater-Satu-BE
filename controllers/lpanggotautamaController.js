const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Lpanggotautama = require('../models/lpanggotautamaModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

exports.getAllLpanggotautama = catchAsync(async (req, res, next) => {
  const lpanggotautama = await Lpanggotautama.findAll();

  res.status(200).json({
    status: 'success',
    results: lpanggotautama.length,
    data: lpanggotautama,
  });
});

exports.createLpanggotautama = catchAsync(async (req, res, next) => {
  const lpanggotautama = await Lpanggotautama.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      lpanggotautama,
    },
  });
});

exports.updateLpanggotautama = catchAsync(async (req, res, next) => {
  // Find the berita record by ID
  const lpanggotautama = await Lpanggotautama.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!lpanggotautama) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  await lpanggotautama.update(req.body);

  res.status(200).json({
    status: 'success',
    data: lpanggotautama,
  });
});

exports.getLpanggotautama = catchAsync(async (req, res, next) => {
  const lpanggotautama = await Lpanggotautama.findByPk(req.params.id);

  if (!lpanggotautama) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: lpanggotautama,
  });
});

exports.deleteLpanggotautama = handlerFactory.deleteOne(Lpanggotautama);
