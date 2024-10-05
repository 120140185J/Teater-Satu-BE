const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Tiketgratis = require('../models/tiketgratisModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadTiketgratisPhoto = upload.single('fotoTiket');

exports.getAllTiketgratis = catchAsync(async (req, res, next) => {
  const tiketgratis = await Tiketgratis.findAll();

  res.status(200).json({
    status: 'success',
    results: tiketgratis.length,
    data: tiketgratis,
  });
});

exports.createTiketgratis = catchAsync(async (req, res, next) => {
  const { judul, jumlahtiket, deskripsi, linktiket } = req.body;
  const { file } = req;

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const tiketgratis = await Tiketgratis.create({
    judul,
    fotoTiket: url,
    deskripsi,
    jumlahtiket,
    linktiket,
  });

  res.status(201).json({
    status: 'success',
    data: {
      tiketgratis: tiketgratis,
    },
  });
});

exports.updateTiketgratis = catchAsync(async (req, res, next) => {
  const { judul, deskripsi, linktiket, jumlahtiket } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const tiketgratis = await Tiketgratis.findByPk(req.params.id);

  if (!tiketgratis) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (judul) tiketgratis.judul = judul;
  if (deskripsi) tiketgratis.deskripsi = deskripsi;
  if (jumlahtiket) tiketgratis.jumlahtiket = jumlahtiket;
  if (linktiket) tiketgratis.linktiket = linktiket;

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer, tiketgratis.photo_url);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    tiketgratis.foto = uploadedFile.secure_url;
  }

  await tiketgratis.save();

  res.status(200).json({
    status: 'success',
    data: tiketgratis,
  });
});

exports.getTiketgratis = catchAsync(async (req, res, next) => {
  const tiketgratis = await Tiketgratis.findByPk(req.params.id);

  if (!tiketgratis) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: tiketgratis,
  });
});

exports.deleteTiketgratis = handlerFactory.deleteOne(Tiketgratis);
