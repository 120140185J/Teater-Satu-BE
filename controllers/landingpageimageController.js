const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Landingpageimage = require('../models/landingpageimageModels');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

exports.getAllLandingpageimage = catchAsync(async (req, res, next) => {
  const landingpageimage = await Landingpageimage.findAll();

  res.status(200).json({
    status: 'success',
    results: landingpageimage.length,
    data: landingpageimage,
  });
});

exports.createLandingpageimage = catchAsync(async (req, res, next) => {
  const landingpageimage = await Landingpageimage.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      landingpageimage,
    },
  });
});

exports.updateLandingpageimage = catchAsync(async (req, res, next) => {
  // Find the berita record by ID
  const landingpageimage = await Landingpageimage.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!landingpageimage) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  // Update the berita record with the new data
  await landingpageimage.update(req.body);

  res.status(200).json({
    status: 'success',
    data: landingpageimage,
  });
});

exports.getLandingpageimage = catchAsync(async (req, res, next) => {
  const landingpageimage = await Landingpageimage.findByPk(req.params.id);

  if (!landingpageimage) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  res.status(200).json({
    status: 'success',
    data: landingpageimage,
  });
});

exports.deleteLandingpageimage = handlerFactory.deleteOne(Landingpageimage);
