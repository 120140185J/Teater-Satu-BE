const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Subsnaskah = require('../models/subsnaskahModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadSubsnaskahPhoto = upload.single('gambar_subsnaskah');

exports.getAllSubsnaskah = catchAsync(async (req, res, next) => {
  const subsnaskah = await Subsnaskah.findAll();

  res.status(200).json({
    status: 'success',
    results: subsnaskah.length,
    data: subsnaskah,
  });
});

exports.createSubsaskah = catchAsync(async (req, res, next) => {
  const { namaSubsnaskah, pengarang, isiSubsnaskah } = req.body;
  const { file } = req;

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const subsnaskah = await Subsnaskah.create({
    namaSubsnaskah,
    fotoThumbnail: url,
    pengarang,
    isiSubsnaskah,
  });

  res.status(201).json({
    status: 'success',
    data: {
      subsnaskah,
    },
  });
});

exports.updateSubsnaskah = catchAsync(async (req, res, next) => {
  const { namaSubsnaskah, pengarang, isiSubsnaskah } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const subsnaskah = await Subsnaskah.findByPk(req.params.id);

  if (!subsnaskah) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (namaSubsnaskah) subsnaskah.namaSubsnaskah = namaSubsnaskah;
  if (pengarang) subsnaskah.pengarang = pengarang;
  if (isiSubsnaskah) subsnaskah.isiSubsnaskah = isiSubsnaskah;
  

  if (file) {
    const uploadedFile = await fileHelper.upload(
      file.buffer,
      subsnaskah.photo_url
    );
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    subsnaskah.foto = uploadedFile.secure_url;
  }

  await subsnaskah.save();

  res.status(200).json({
    status: 'success',
    data: subsnaskah,
  });
});

exports.getSubsaskah = catchAsync(async (req, res, next) => {
  const subsnaskah = await Subsnaskah.findByPk(req.params.id);

  if (!subsnaskah) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: subsnaskah,
  });
});

exports.deleteSubsaskah = handlerFactory.deleteOne(Subsnaskah);
