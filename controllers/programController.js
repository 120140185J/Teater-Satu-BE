const multer = require('multer');
const fileHelper = require('../utils/fileHelper');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Program = require('../models/programModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

// Konfigurasi Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadProgramPhotos = upload.fields([
  { name: 'photo_url', maxCount: 1 },
  { name: 'photo_thumbnail_url', maxCount: 1 },
  { name: 'photo_url_2', maxCount: 1 },
]);

exports.getAllProgram = catchAsync(async (req, res, next) => {
  const program = await Program.findAll({});

  res.status(200).json({
    status: 'success',
    results: program.length,
    data: program,
  });
});

// Create Program
exports.createProgram = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    summary,
    description2,
    description3,
    link,
    date,
  } = req.body;
  const { files } = req;

  // Logging untuk debugging
  console.log('Received files:', files);

  // Validasi keberadaan file yang diperlukan
  if (
    !files ||
    !files.photo_url ||
    !files.photo_thumbnail_url ||
    !files.photo_url_2
  ) {
    return next(
      new AppError(
        'Semua file gambar harus diunggah: photo_url, photo_thumbnail_url, dan photo_url_2 diperlukan',
        400
      )
    );
  }

  let photoUrl = '';
  let gambar1Url = '';
  let gambar2Url = '';

  // Upload photo_url
  const photoUrlUpload = await fileHelper.upload(files.photo_url[0].buffer);
  if (!photoUrlUpload) {
    return next(new AppError('Error saat mengunggah photo_url', 400));
  }
  photoUrl = photoUrlUpload.secure_url;

  // Upload photo_thumbnail_url
  const thumbnailUrlUpload = await fileHelper.upload(
    files.photo_thumbnail_url[0].buffer
  );
  if (!thumbnailUrlUpload) {
    return next(new AppError('Error saat mengunggah photo_thumbnail_url', 400));
  }
  gambar1Url = thumbnailUrlUpload.secure_url;

  // Upload photo_url_2
  const photoUrl2Upload = await fileHelper.upload(files.photo_url_2[0].buffer);
  if (!photoUrl2Upload) {
    return next(new AppError('Error saat mengunggah photo_url_2', 400));
  }
  gambar2Url = photoUrl2Upload.secure_url;

  // Buat program baru
  const program = await Program.create({
    title,
    description,
    summary,
    photo_url: photoUrl,
    photo_thumbnail_url: gambar1Url,
    photo_url_2: gambar2Url,
    description2,
    description3,
    link,
    date,
  });

  res.status(201).json({
    status: 'success',
    data: {
      program,
    },
  });
});

// Update Program
exports.updateProgram = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    summary,
    description2,
    description3,
    link,
    date,
  } = req.body;
  const { files } = req;

  // Temukan program berdasarkan ID
  const program = await Program.findByPk(req.params.id);
  if (!program) {
    return next(
      new AppError('Program dengan ID tersebut tidak ditemukan', 404)
    );
  }

  // Update field teks jika ada
  if (title) program.title = title;
  if (description) program.description = description;
  if (summary) program.summary = summary;
  if (description2) program.description2 = description2;
  if (description3) program.description3 = description3;
  if (link) program.link = link;
  if (date) program.date = date;

  // Update gambar jika ada file baru
  if (files) {
    if (files.photo_url) {
      const uploadedFile = await fileHelper.upload(files.photo_url[0].buffer);
      if (!uploadedFile) {
        return next(new AppError('Error saat mengunggah photo_url', 400));
      }
      program.photo_url = uploadedFile.secure_url;
    }
    if (files.photo_thumbnail_url) {
      const uploadedFile = await fileHelper.upload(
        files.photo_thumbnail_url[0].buffer
      );
      if (!uploadedFile) {
        return next(
          new AppError('Error saat mengunggah photo_thumbnail_url', 400)
        );
      }
      program.photo_thumbnail_url = uploadedFile.secure_url;
    }
    if (files.photo_url_2) {
      const uploadedFile = await fileHelper.upload(files.photo_url_2[0].buffer);
      if (!uploadedFile) {
        return next(new AppError('Error saat mengunggah photo_url_2', 400));
      }
      program.photo_url_2 = uploadedFile.secure_url;
    }
  }

  await program.save();

  res.status(200).json({
    status: 'success',
    data: program,
  });
});

// Get Program
exports.getProgram = catchAsync(async (req, res, next) => {
  const program = await Program.findByPk(req.params.id);

  if (!program) {
    return next(
      new AppError('Program dengan ID tersebut tidak ditemukan', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: program,
  });
});

// Delete Program
exports.deleteProgram = handlerFactory.deleteOne(Program);
