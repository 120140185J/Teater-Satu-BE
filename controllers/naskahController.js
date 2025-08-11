const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');
const Naskah = require('../models/naskahModel');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

exports.uploadNaskahPhoto = upload.fields([
  { name: 'gambar_naskah', maxCount: 1 }, // Untuk gambar/video
  { name: 'file_naskah', maxCount: 1 }, // Untuk .pdf/.docx
]);

exports.getAllNaskah = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const parsedLimit = parseInt(limit, 10);
  const parsedPage = parseInt(page, 10);
  const offset = (parsedPage - 1) * parsedLimit;

  if (
    isNaN(parsedLimit) ||
    parsedLimit <= 0 ||
    isNaN(parsedPage) ||
    parsedPage <= 0
  ) {
    return next(new AppError('Invalid page or limit value', 400));
  }

  const naskah = await Naskah.findAll({
    limit: parsedLimit,
    offset: offset,
  });

  const total = await Naskah.count();

  res.status(200).json({
    status: 'success',
    results: naskah.length,
    total,
    data: naskah,
  });
});

exports.createNaskah = catchAsync(async (req, res, next) => {
  const { namaNaskah, pengarang, isiNaskah, linknaskah } = req.body;
  const files = req.files || {};

  if (!namaNaskah || !pengarang || !isiNaskah || !linknaskah) {
    return next(new AppError('All fields are required', 400));
  }

  let fotoThumbnail = null;
  let fileUrl = null;

  if (files.gambar_naskah) {
    const uploadedFile = await fileHelper.upload(files.gambar_naskah[0].buffer);
    if (!uploadedFile)
      return next(new AppError('Error uploading gambar_naskah', 400));
    fotoThumbnail = uploadedFile.secure_url;
  }

  if (files.file_naskah) {
    const uploadedFile = await fileHelper.upload(files.file_naskah[0].buffer);
    if (!uploadedFile)
      return next(new AppError('Error uploading file_naskah', 400));
    fileUrl = uploadedFile.secure_url;
  }

  const naskah = await Naskah.create({
    namaNaskah,
    fotoThumbnail,
    fileUrl,
    pengarang,
    isiNaskah,
    linknaskah,
  });

  res.status(201).json({
    status: 'success',
    data: { naskah },
  });
});

exports.updateNaskah = catchAsync(async (req, res, next) => {
  const { namaNaskah, pengarang, isiNaskah, linknaskah } = req.body;
  const files = req.files || {};

  const naskah = await Naskah.findByPk(req.params.id);
  if (!naskah) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  if (
    !namaNaskah &&
    !pengarang &&
    !isiNaskah &&
    !linknaskah &&
    !files.gambar_naskah &&
    !files.file_naskah
  ) {
    return next(new AppError('No data provided for update', 400));
  }

  if (namaNaskah) naskah.namaNaskah = namaNaskah;
  if (pengarang) naskah.pengarang = pengarang;
  if (isiNaskah) naskah.isiNaskah = isiNaskah;
  if (linknaskah) naskah.linknaskah = linknaskah;

  if (files.gambar_naskah) {
    if (naskah.fotoThumbnail)
      await fileHelper.upload(null, naskah.fotoThumbnail); // Hapus lama
    const uploadedFile = await fileHelper.upload(files.gambar_naskah[0].buffer);
    if (!uploadedFile)
      return next(new AppError('Error uploading gambar_naskah', 400));
    naskah.fotoThumbnail = uploadedFile.secure_url;
  }

  if (files.file_naskah) {
    if (naskah.fileUrl) await fileHelper.upload(null, naskah.fileUrl); // Hapus lama
    const uploadedFile = await fileHelper.upload(files.file_naskah[0].buffer);
    if (!uploadedFile)
      return next(new AppError('Error uploading file_naskah', 400));
    naskah.fileUrl = uploadedFile.secure_url;
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
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  res.status(200).json({
    status: 'success',
    data: naskah,
  });
});

exports.deleteNaskah = catchAsync(async (req, res, next) => {
  const naskah = await Naskah.findByPk(req.params.id);
  if (!naskah) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  if (naskah.fotoThumbnail) await fileHelper.upload(null, naskah.fotoThumbnail);
  if (naskah.fileUrl) await fileHelper.upload(null, naskah.fileUrl);

  await naskah.destroy();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
