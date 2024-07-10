const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Naskah = require('../models/naskahModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadNaskahPhoto = upload.single('gambar_naskah');

exports.getAllNaskah = catchAsync(async (req, res, next) => {
  const naskah = await Naskah.findAll();

  res.status(200).json({
    status: 'success',
    results: naskah.length,
    data: naskah,
  });
});

exports.createNaskah = catchAsync(async (req, res, next) => {
  const { namaNaskah, pengarang, isiNaskah } = req.body;
  const { file } = req;

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const naskah = await Naskah.create({
    namaNaskah,
    fotoThumbnail: url,
    pengarang,
    isiNaskah,
  });

  res.status(201).json({
    status: 'success',
    data: {
      naskah,
    },
  });
});

exports.updateNaskah = catchAsync(async (req, res, next) => {
  const { namaNaskah, pengarang, isiNaskah } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const naskah = await Naskah.findByPk(req.params.id);

  if (!naskah) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (namaNaskah) naskah.namaNaskah = namaNaskah;
  if (pengarang) naskah.pengarang = pengarang;
  if (isiNaskah) naskah.isiNaskah = isiNaskah;
  

  if (file) {
    const uploadedFile = await fileHelper.upload(
      file.buffer,
      naskah.photo_url
    );
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    naskah.foto = uploadedFile.secure_url;
  }

  await naskah.save();

  res.status(200).json({
    status: 'success',
    data: naskah,
  });
});

exports.getNaskah = catchAsync(async (req, res, next) => {
  const naskah = await Naskah.findByPk(req.params.id);

  if (!naskah) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: naskah,
  });
});

exports.deleteNaskah = handlerFactory.deleteOne(Naskah);
