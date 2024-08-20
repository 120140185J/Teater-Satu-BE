const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const BeritaPatner = require('../models/beritapatnerModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadBeritaPatnerPhoto = upload.single('photo_url');

exports.getAllBeritaPatner = catchAsync(async (req, res, next) => {
  const beritapatner = await BeritaPatner.findAll({});

  res.status(200).json({
    status: 'success',
    results: beritapatner.length,
    data: beritapatner,
  });
});

exports.createBeritaPatner = catchAsync(async (req, res, next) => {
  const { title, description, summary } = req.body;
  const { file } = req;

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const beritapatner = await BeritaPatner.create({
    title,
    description,
    summary,
    photo_url: url,
  });

  res.status(201).json({
    status: 'success',
    data: {
      beritapatner,
    },
  });
});

exports.updateBeritaPatner = catchAsync(async (req, res, next) => {
  const { title, description, summary } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const beritapatner = await BeritaPatner.findByPk(req.params.id);

  if (!beritapatner) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (title) beritapatner.title = title;
  if (description) beritapatner.description = description;
  if (summary) beritapatner.summary = summary;

  if (file) {
    const uploadedFile = await fileHelper.upload(
      file.buffer,
      beritapatner.photo_url
    );
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    beritapatner.photo_url = uploadedFile.secure_url;
  }

  await beritapatner.save();

  res.status(200).json({
    status: 'success',
    data: beritapatner,
  });
});

exports.getBeritaPatner = catchAsync(async (req, res, next) => {
  const beritapatner = await BeritaPatner.findByPk(req.params.id, {});

  if (!beritapatner) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: beritapatner,
  });
});

exports.deleteBeritaPatner = handlerFactory.deleteOne(BeritaPatner);
