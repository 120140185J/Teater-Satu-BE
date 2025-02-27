const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Donasi = require('../models/donasiModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploaddonasiPhotos = upload.fields([
  { name: 'gambar', maxCount: 1 },
]);

exports.getAlldonasi = catchAsync(async (req, res, next) => {
  const donasi = await Donasi.findAll({});

  res.status(200).json({
    status: 'success',
    results: donasi.length,
    data: donasi,
  });
});

exports.createdonasi = catchAsync(async (req, res, next) => {
  const { paragraf1, paragraf2, paragraf3, link } = req.body;
  const { files } = req;

  let gambarUrl = '';

  if (files.gambar) {
    const uploadedFile = await fileHelper.upload(files.gambar[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading gambar', 400));
    }
    gambarUrl = uploadedFile.secure_url;
  }

  const berita = await Donasi.create({
    gambar: gambarUrl,
    paragraf1,
    paragraf2,
    paragraf3,
    link,
  });

  res.status(201).json({
    status: 'success',
    data: {
      berita,
    },
  });
});

exports.updatedonasi = catchAsync(async (req, res, next) => {
  const { paragraf1, paragraf2, paragraf3, link } = req.body;
  const { files } = req;

  // Find the berita record by ID
  const donasi = await Donasi.findByPk(req.params.id);

  if (!donasi) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update text fields if provided
  if (paragraf1) donasi.paragraf1 = paragraf1;
  if (paragraf2) donasi.paragraf2 = paragraf2;
  if (paragraf3) donasi.paragraf3 = paragraf3;
  if (link) donasi.link = link;

  // Handle gambar update
  if (files && files.gambar) {
    const uploadedFile = await fileHelper.upload(files.gambar[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading gambar', 400));
    }
    donasi.gambar = uploadedFile.secure_url;
  }

  await donasi.save();

  res.status(200).json({
    status: 'success',
    data: donasi,
  });
});

exports.getDonasi = catchAsync(async (req, res, next) => {
  const donasi = await Donasi.findByPk(req.params.id, {});

  if (!donasi) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: donasi,
  });
});

exports.deleteDonasi = handlerFactory.deleteOne(Donasi);