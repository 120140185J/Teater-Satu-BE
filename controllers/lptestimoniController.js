const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Lptestimoni = require('../models/lptestimoniModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadLptestimoniPhoto = upload.single('photo_url');

exports.getAllLptestimoni = catchAsync(async (req, res, next) => {
  const lptestimoni = await Lptestimoni.findAll({
  });

  res.status(200).json({
    status: 'success',
    results: lptestimoni.length,
    data: lptestimoni,
  });
});

exports.createLptestimoni = catchAsync(async (req, res, next) => {
  const { quote, nama, jabatan} = req.body;
  const { file } = req;

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const lptestimoni = await Lptestimoni.create({
    quote,
    nama,
    jabatan,
    photo_url: url,
  });

  res.status(201).json({
    status: 'success',
    data: {
        lptestimoni,
    },
  });
});

exports.updateLptestimoni = catchAsync(async (req, res, next) => {
  const { quote, nama, jabatan} = req.body;
  const { file } = req;

  // Find the berita record by ID
  const lptestimoni = await Lptestimoni.findByPk(req.params.id);

  if (!lptestimoni) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (quote) lptestimoni.quote = quote;
  if (nama) lptestimoni.nama = nama;
  if (jabatan) lptestimoni.jabatan = jabatan;
  
  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer, lptestimoni.photo_url);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    lptestimoni.photo_url = uploadedFile.secure_url;
  }

  await lptestimoni.save();

  res.status(200).json({
    status: 'success',
    data: lptestimoni,
  });
});

exports.getLptestimoni = catchAsync(async (req, res, next) => {
  const lptestimoni = await Lptestimoni.findByPk(req.params.id, {
  });

  if (!lptestimoni) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: lptestimoni,
  });
});

exports.deleteLptestimoni = handlerFactory.deleteOne(Lptestimoni);
