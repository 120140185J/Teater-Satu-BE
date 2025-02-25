const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const BeritaPatner = require('../models/beritapatnerModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadBeritaPatnerPhoto = upload.fields([
  { name: 'photo_url', maxCount: 1 },
  { name: 'gambar1', maxCount: 1 },
  { name: 'gambar2', maxCount: 1 },
]);

exports.getAllBeritaPatner = catchAsync(async (req, res, next) => {
  const beritapatner = await BeritaPatner.findAll({});

  res.status(200).json({
    status: 'success',
    results: beritapatner.length,
    data: beritapatner,
  });
});

exports.createBeritaPatner = catchAsync(async (req, res, next) => {
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

  if (files.gambar1) {
    const uploadedFile = await fileHelper.upload(files.gambar1[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading gambar1', 400));
    }
    gambar1Url = uploadedFile.secure_url;
  }

  if (files.gambar2) {
    const uploadedFile = await fileHelper.upload(files.gambar2[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading gambar2', 400));
    }
    gambar2Url = uploadedFile.secure_url;
  }

  const beritapatner = await BeritaPatner.create({
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
      beritapatner,
    },
  });
});

exports.updateBeritaPatner = catchAsync(async (req, res, next) => {
  const { title, description, summary, description2, description3, link } =
    req.body;
  const { files } = req;

  let photoUrl = '';
  let gambar1Url = '';
  let gambar2Url = '';

  // Find the berita record by ID
  const beritapatner = await BeritaPatner.findByPk(req.params.id);

  if (!beritapatner) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (title) beritapatner.title = title;
  if (description) beritapatner.description = description;
  if (summary) beritapatner.summary = summary;
  if (description2) beritapatner.description2 = description2;
  if (description3) beritapatner.description3 = description3;
  if (link) beritapatner.link = link;

  if (files.photo_url) {
    const uploadedFile = await fileHelper.upload(files.photo_url[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading photo_url', 400));
    }
    photoUrl = uploadedFile.secure_url;
    beritapatner.photo_url = photoUrl;
  }

  if (files.gambar1) {
    const uploadedFile = await fileHelper.upload(files.gambar1[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading gambar1', 400));
    }
    gambar1Url = uploadedFile.secure_url;
    beritapatner.gambar1 = gambar1Url;
  }

  if (files.gambar2) {
    const uploadedFile = await fileHelper.upload(files.gambar2[0].buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading gambar2', 400));
    }
    gambar2Url = uploadedFile.secure_url;
    beritapatner.gambar2 = gambar2Url;
  }

  await beritapatner.save();

  res.status(200).json({
    status: 'success',
    data: beritapatner,
  });
});

exports.getBeritaPatner = catchAsync(async (req, res, next) => {
  const beritapatner = await BeritaPatner.findByPk(req.params.id, {});

  if (!beritapatner) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: beritapatner,
  });
});

exports.deleteBeritaPatner = handlerFactory.deleteOne(BeritaPatner);
