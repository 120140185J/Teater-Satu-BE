const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Program = require('../models/programModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

exports.getAllProgram = catchAsync(async (req, res, next) => {
  const program = await Program.findAll({});

  res.status(200).json({
    status: 'success',
    results: program.length,
    data: program,
  });
});

exports.createProgram = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line camelcase
  const { title, description, summary, photo_thumbnail_url, photo_url, photo_url_2, } =
    req.body;

  const program = await Program.create({
    title,
    description,
    summary,
    // eslint-disable-next-line camelcase
    photo_thumbnail_url,
    // eslint-disable-next-line camelcase
    photo_url,
    // eslint-disable-next-line camelcase
    photo_url_2,
  });   

  res.status(201).json({
    status: 'success',
    data: {
      program,
    },
  });
});

exports.updateProgram = catchAsync(async (req, res, next) => {
  const { title, description, summary, photo_thumbnail_url, photo_url, photo_url_2, } =
    req.body;

  // Find the berita record by ID
  const program = await Program.findByPk(req.params.id);

  if (!program) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (title) program.title = title;
  if (description) program.description = description;
  if (summary) program.summary = summary;
  if (photo_thumbnail_url) program.photo_thumbnail_url = photo_thumbnail_url;
  if (photo_url) program.photo_url = photo_url;
  if (photo_url_2) program.photo_url_2 = photo_url_2;

  await program.save();

  res.status(200).json({
    status: 'success',
    data: program,
  });
});

exports.getProgram = catchAsync(async (req, res, next) => {
  const program = await Program.findByPk(req.params.id);

  if (!program) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: program,
  });
});

exports.deleteProgram = handlerFactory.deleteOne(Program);
