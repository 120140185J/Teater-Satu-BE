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

exports.uploadBeritaKolaborasiPhotos = upload.fields([
  { name: 'photo_url', maxCount: 1 },
  { name: 'gambar_1', maxCount: 1 },
  { name: 'gambar_2', maxCount: 1 },
]);

exports.getAllBeritaKolaborasi = catchAsync(async (req, res, next) => {
  const beritakolaborasi = await BeritaKolaborasi.findAll({});

  res.status(200).json({
    status: 'success',
    results: beritakolaborasi.length,
    data: beritakolaborasi,
  });
});

exports.createBeritaKolaborasi = catchAsync(async (req, res, next) => {
  const { title, description, summary, description2, description3, link } =
    req.body;
  const { files } = req;

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

  const berita = await BeritaKolaborasi.create({
    title,
    description,
    summary,
    photo_url: photoUrl,
    gambar1: gambar1Url,
    gambar2: gambar2Url,
    description2,
    description3,
    link,
  });

  res.status(201).json({
    status: 'success',
    data: {
      berita,
    },
  });
});

exports.updateBeritaKolaborasi = catchAsync(async (req, res, next) => {
  const { title, description, summary, description2, description3, link } =
    req.body;
  const { files } = req;

  // Find the berita record by ID
  const beritakolaborasi = await BeritaKolaborasi.findByPk(req.params.id);

  if (!beritakolaborasi) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update text fields if provided
  if (title) beritakolaborasi.title = title;
  if (description) beritakolaborasi.description = description;
  if (summary) beritakolaborasi.summary = summary;
  if (description2) beritakolaborasi.description2 = description2;
  if (description3) beritakolaborasi.description3 = description3;
  if (link) beritakolaborasi.link = link;

  // Handle photo_url update
  if (files && files.photo_url) {
    const uploadedFile = await fileHelper.upload(files.photo_url[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading photo_url', 400));
    }
    beritakolaborasi.photo_url = uploadedFile.secure_url;
  }

  // Handle gambar_1 update
  if (files && files.gambar_1) {
    const uploadedFile = await fileHelper.upload(files.gambar_1[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading gambar_1', 400));
    }
    beritakolaborasi.gambar1 = uploadedFile.secure_url;
  }

  // Handle gambar_2 update
  if (files && files.gambar_2) {
    const uploadedFile = await fileHelper.upload(files.gambar_2[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading gambar_2', 400));
    }
    beritakolaborasi.gambar2 = uploadedFile.secure_url;
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
