// const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Subsvideo = require('../models/subsvideoModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

// const upload = multer({
//   storage: multer.memoryStorage(),
// });

// exports.uploadSubsvideoPhoto = upload.single('photo_url');

// exports.getAllSubsvideo = catchAsync(async (req, res, next) => {
//   const Subsvideo = await Subsvideo.findAll();

//   res.status(200).json({
//     status: 'success',
//     results: subsvideo.length,
//     data: subsvideo,
//   });
// });

exports.createSubsvideo = catchAsync(async (req, res, next) => {
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

  const subsvideo = await Subsvideo.create({
    title,
    description,
    summary,
    photo_url: url,
  });

  res.status(201).json({
    status: 'success',
    data: {
        subsvideo,
    },
  });
});

exports.updateSubsvideo = catchAsync(async (req, res, next) => {
  const { title, description, summary } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const subsvideo = await Subsvideo.findByPk(req.params.id);

  if (!subsvideo) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (title) subsvideo.title = title;
  if (description) subsvideo.description = description;
  if (summary) subsvideo.summary = summary;

  if (file) {
    const uploadedFile = await fileHelper.upload(
      file.buffer,
      subsvideo.photo_url
    );
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    subsvideo.photo_url = uploadedFile.secure_url;
  }

  await subsvideo.save();

  res.status(200).json({
    status: 'success',
    data: subsvideo,
  });
});

exports.getSubsvideo = catchAsync(async (req, res, next) => {
  const subsvideo = await Subsvideo.findByPk(req.params.id);

  if (!subsvideo) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: subsvideo,
  });
});

exports.deleteSubsvideo = handlerFactory.deleteOne(Subsvideo);
