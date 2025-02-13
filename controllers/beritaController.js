const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Berita = require('../models/beritaModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadBeritaPhotos = upload.fields([
  { name: 'photo_url', maxCount: 1 },
  { name: 'gambar_1', maxCount: 1 },
  { name: 'gambar_2', maxCount: 1 },
]);

exports.getAllBerita = catchAsync(async (req, res, next) => {
  const berita = await Berita.findAll({
  });

  res.status(200).json({
    status: 'success',
    results: berita.length,
    data: berita,
  });
});

// filepath: /d:/kodingan yusuf/TA LULUS 2024!!!/Ta Capstone/koding/BE WEB TS/backend-teater-satu/controllers/beritaController.js
exports.createBerita = catchAsync(async (req, res, next) => {
  const { title, description, summary } = req.body;
  const {files} = req;

  let photoUrl = '';
  let gambar1Url = '';
  let gambar2Url = '';

  if (files.photo_url) {
    const uploadedFile = await fileHelper.upload(files.photo_url[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading photo_url', 400));
    }
    photoUrl = uploadedFile.secure_url;
  }

  if (files.gambar_1) {
    const uploadedFile = await fileHelper.upload(files.gambar_1[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading gambar_1', 400));
    }
    gambar1Url = uploadedFile.secure_url;
  }

  if (files.gambar_2) {
    const uploadedFile = await fileHelper.upload(files.gambar_2[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading gambar_2', 400));
    }
    gambar2Url = uploadedFile.secure_url;
  }

  const berita = await Berita.create({
    title,
    description,
    summary,
    photo_url: photoUrl,
    gambar_1: gambar1Url,
    gambar_2: gambar2Url,
  });

  res.status(201).json({
    status: 'success',
    data: {
      berita,
    },
  });
});

exports.updateBerita = catchAsync(async (req, res, next) => {
  const { title, description, summary} = req.body;
  const { file } = req;

  // Find the berita record by ID
  const berita = await Berita.findByPk(req.params.id);

  if (!berita) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (title) berita.title = title;
  if (description) berita.description = description;
  if (summary) berita.summary = summary;
  
  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer, berita.photo_url);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    berita.photo_url = uploadedFile.secure_url;
  }

  await berita.save();

  res.status(200).json({
    status: 'success',
    data: berita,
  });
});

exports.getBerita = catchAsync(async (req, res, next) => {
  const berita = await Berita.findByPk(req.params.id, {
  });

  if (!berita) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: berita,
  });
});

exports.deleteBerita = handlerFactory.deleteOne(Berita);
