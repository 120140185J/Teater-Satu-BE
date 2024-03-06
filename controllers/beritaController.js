const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Berita = require('../models/beritaModel');
const Kategori = require('../models/kategoriModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadBeritaPhoto = upload.single('photo_url');

exports.getAllBerita = catchAsync(async (req, res, next) => {
  const berita = await Berita.findAll({
    include: [Kategori],
  });

  res.status(200).json({
    status: 'success',
    results: berita.length,
    data: berita,
  });
});

exports.createBerita = catchAsync(async (req, res, next) => {
  const { title, description, kategori } = req.body;
  const { file } = req;

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  let kategoriObj = await Kategori.findOne({ where: { name: kategori } });
  // If the kategori does not exist, create a new one
  if (!kategoriObj) {
    kategoriObj = await Kategori.create({ name: kategori });
  }

  console.log({
    title,
    description,
    photo_url: url,
    kategori_id: kategoriObj.id,
  });

  const berita = await Berita.create({
    title,
    description,
    photo_url: url,
    kategori_id: kategoriObj.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      berita,
    },
  });
});

exports.updateBerita = catchAsync(async (req, res, next) => {
  const { title, description, kategori } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const berita = await Berita.findByPk(req.params.id);

  if (!berita) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (title) berita.title = title;
  if (description) berita.description = description;
  if (kategori) {
    // Get the Kategori object based on the kategori name
    let kategoriObj = await Kategori.findOne({ where: { name: kategori } });

    // If the kategori does not exist, create a new one
    if (!kategoriObj) {
      kategoriObj = await Kategori.create({ name: kategori });
    }

    // Update the berita record with the kategori_id field
    berita.kategori_id = kategoriObj.id;
  }
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
    include: [Kategori],
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
