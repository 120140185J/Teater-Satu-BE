const multer = require('multer');
const Profileanggota = require('../models/profilanggotaModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');
const Profilanggota = require('../models/profilanggotaModel');

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadProfilanggotaPhoto = upload.single('photo');

exports.getAllProfilanggota = factory.getAll(Profileanggota);
exports.getProfileanggota = factory.getOne(Profileanggota);
exports.createProfilanggota = catchAsync(async (req, res, next) => {
  const { nama, jabatan, deskripsi } = req.body;
  const { file } = req;

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const profilanggota = await Profileanggota.create({
    nama,
    photo: url,
    jabatan,
    deskripsi,
  });

  res.status(201).json({
    status: 'success',
    data: {
      profilanggota,
    },
  });
});

exports.updateProfilanggota = catchAsync(async (req, res, next) => {
  const { nama, jabatan, deskripsi } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const profilanggota = await Profilanggota.findByPk(req.params.id);

  if (!profilanggota) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (nama) profilanggota.nama = nama;
  if (jabatan) profilanggota.jabatan = jabatan;
  if (deskripsi) profilanggota.deskripsi = deskripsi;

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer, profilanggota.photo_url);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    profilanggota.gambar_profilanggota = uploadedFile.secure_url;
  }

  await profilanggota.save();

  res.status(200).json({
    status: 'success',
    data: profilanggota,
  });
});

exports.deleteProfilanggota = factory.deleteOne(Profileanggota);
