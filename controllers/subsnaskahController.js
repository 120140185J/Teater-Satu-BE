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
  const subsnaskah = await Subsnaskah.findAll({
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    status: 'success',
    results: subsnaskah.length,
    data: subsnaskah,
  });
});

exports.createSubsnaskah = catchAsync(async (req, res, next) => {
  const { naskah, pengarang, kategori, summary, isi } = req.body;
  const { file } = req;

  if(!naskah) {
    return next(new AppError('Naskah is required', 400));
  }

  if(!pengarang) {
    return next(new AppError('Pengarang is required', 400));
  }

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const subsnaskah = await Subsnaskah.create({
    nama_naskah: naskah,
    file_naskah: url,
    pengarang,
    kategori_naskah: kategori,
    summary,
    isi_naskah: isi,
  });

  res.status(201).json({
    status: 'success',
    data: subsnaskah
  });
});

exports.updateSubsnaskah = catchAsync(async (req, res, next) => {
  const { naskah, pengarang, kategori, summary, isi } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const subsnaskah = await Subsnaskah.findByPk(req.params.id);

  if (!subsnaskah) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (naskah) subsnaskah.nama_naskah = naskah;
  if (pengarang) subsnaskah.pengarang = pengarang;
  if (isi) subsnaskah.isi_naskah = isi;
  if (summary) subsnaskah.summary = summary;
  if (kategori) subsnaskah.kategori_naskah = kategori;

  if (file) {
    const uploadedFile = await fileHelper.upload(
      file.buffer,
      subsnaskah.file_naskah
    );
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    subsnaskah.file_naskah = uploadedFile.secure_url;
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

exports.deleteSubsnaskah = handlerFactory.deleteOne(Subsnaskah);
