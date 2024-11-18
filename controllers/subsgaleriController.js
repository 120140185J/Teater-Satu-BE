const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Subsgaleri = require('../models/subsgaleriModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadSubsgaleriPhoto = upload.single('thumbnail');

exports.getAllSubsgaleri = catchAsync(async (req, res, next) => {
  const subsgaleri = await Subsgaleri.findAll({
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    status: 'success',
    results: subsgaleri.length,
    data: subsgaleri,
  });
});

exports.createSubsgaleri = catchAsync(async (req, res, next) => {
  const { judul, karya, deskripsi } = req.body;
  const { file } = req;

  if(!judul) {
    return next(new AppError('Judul is required', 400));
  }

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const subsgaleri = await Subsgaleri.create({
    judul,
    karya,
    deskripsi,
    thumbnail: url,
  });

  res.status(201).json({
    status: 'success',
    data: subsgaleri,
  });
});

exports.updateSubsgaleri = catchAsync(async (req, res, next) => {
  const { judul, karya, deskripsi } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const subsgaleri = await Subsgaleri.findByPk(req.params.id);

  if (!subsgaleri) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (judul) subsgaleri.judul = judul;
  if (karya) subsgaleri.karya = karya;
  if (deskripsi) subsgaleri.deskripsi = deskripsi;

  if (file) {
    const uploadedFile = await fileHelper.upload(
      file.buffer,
      subsgaleri.thumbnail
    );
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    subsgaleri.thumbnail = uploadedFile.secure_url;
  }

  await subsgaleri.save();

  res.status(200).json({
    status: 'success',
    data: subsgaleri,
  });
});

exports.getSubsaskah = catchAsync(async (req, res, next) => {
  const subsgaleri = await Subsgaleri.findByPk(req.params.id);

  if (!subsgaleri) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: subsgaleri,
  });
});

exports.deleteSubsgaleri = handlerFactory.deleteOne(Subsgaleri);
