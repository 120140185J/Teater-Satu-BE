const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Program = require('../models/programModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadProgramPhoto = upload.single('photo_url');

exports.getAllProgram = catchAsync(async (req, res, next) => {
  const program = await Program.findAll();

  res.status(200).json({
    status: 'success',
    results: program.length,
    data: program,
  });
});

exports.createProgram = catchAsync(async (req, res, next) => {
  const { title, description, summary } = req.body;
  const { file } = req;

  let url = '';

  if (!title || !description || !summary) {
    return next(new AppError('All fields are required', 400));
  }

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const program = await Program.create({
    title,
    description,
    summary,
    photo_url: url,
  });

  res.status(201).json({
    status: 'success',
    data: {
      program,
    },
  });
});

exports.updateProgram = catchAsync(async (req, res, next) => {
  const { title, description, summary } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const program = await Program.findByPk(req.params.id);

  if (!program) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (title) program.title = title;
  if (description) program.description = description;
  if (summary) program.summary = summary;

  if (file) {
    const uploadedFile = await fileHelper.upload(
      file.buffer,
      program.photo_url
    );
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    program.photo_url = uploadedFile.secure_url;
  }

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
