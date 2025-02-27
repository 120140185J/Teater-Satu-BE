const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Ipvideo = require('../models/ipvideoModel');
const handlerFactory = require('./handlerFactory');

// Get all Ipvideo entries
exports.getAllIpvideos = catchAsync(async (req, res, next) => {
  const ipvideos = await Ipvideo.findAll({});

  res.status(200).json({
    status: 'success',
    results: ipvideos.length,
    data: ipvideos,
  });
});

// Create a new Ipvideo entry
exports.createIpvideo = catchAsync(async (req, res, next) => {
  const { video1, video2 } = req.body;

  const ipvideo = await Ipvideo.create({
    video1,
    video2,
  });

  res.status(201).json({
    status: 'success',
    data: {
      ipvideo,
    },
  });
});

// Update an existing Ipvideo entry
exports.updateIpvideo = catchAsync(async (req, res, next) => {
  const { video1, video2 } = req.body;

  // Find the Ipvideo record by ID
  const ipvideo = await Ipvideo.findByPk(req.params.id);

  if (!ipvideo) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update fields if provided
  if (video1) ipvideo.video1 = video1;
  if (video2) ipvideo.video2 = video2;

  await ipvideo.save();

  res.status(200).json({
    status: 'success',
    data: ipvideo,
  });
});

// Get a single Ipvideo entry by ID
exports.getIpvideo = catchAsync(async (req, res, next) => {
  const ipvideo = await Ipvideo.findByPk(req.params.id);

  if (!ipvideo) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: ipvideo,
  });
});

// Delete an Ipvideo entry by ID
exports.deleteIpvideo = handlerFactory.deleteOne(Ipvideo);