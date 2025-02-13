const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const BeritaKolaborasi = require('../models/beritakolaborasiModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadBeritaKolaborasiPhoto = upload.single('photo_url');

exports.getAllBeritaKolaborasi = catchAsync(async (req, res, next) => {
  const beritakolaborasi = await BeritaKolaborasi.findAll({});

  res.status(200).json({
    status: 'success',
    results: beritakolaborasi.length,
    data: beritakolaborasi,
  });
});

exports.createBeritaKolaborasi = catchAsync(async (req, res, next) => {
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

  const beritakolaborasi = await BeritaKolaborasi.create({
    title,
    description,
    summary,
    photo_url: url,
    gambar1: url,
    gambar2: url,
  });

  res.status(201).json({
    status: 'success',
    data: {
      beritakolaborasi,
    },
  });
});

exports.updateBeritaKolaborasi = catchAsync(async (req, res, next) => {
  const { title, description, summary } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const beritakolaborasi = await BeritaKolaborasi.findByPk(req.params.id);

  if (!beritakolaborasi) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (title) beritakolaborasi.title = title;
  if (description) beritakolaborasi.description = description;
  if (summary) beritakolaborasi.summary = summary;

  if (file) {
    const uploadedFile = await fileHelper.upload(
      file.buffer,
      beritakolaborasi.photo_url
    );
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    beritakolaborasi.photo_url = uploadedFile.secure_url;
  }

  await beritakolaborasi.save();

  res.status(200).json({
    status: 'success',
    data: beritakolaborasi,
  });
});

exports.getBeritaKolaborasi = catchAsync(async (req, res, next) => {
  const beritakolaborasi = await BeritaKolaborasi.findByPk(req.params.id, {});

  if (!beritakolaborasi) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: beritakolaborasi,
  });
});

exports.deleteBeritaKolaborasi = handlerFactory.deleteOne(BeritaKolaborasi);
