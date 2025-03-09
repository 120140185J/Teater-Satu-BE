const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Ipvideo = require('../models/ipvideoModel');
const { upload: cloudinaryUpload } = require('../utils/fileHelper');

// Konfigurasi penyimpanan sementara di memory
const storage = multer.memoryStorage();

// Filter untuk hanya menerima format video tertentu
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'video/mp4', // MP4
    'video/avi', // AVI
    'video/quicktime', // MOV
    'video/x-ms-wmv', // WMV
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Only MP4, AVI, MOV, and WMV video formats are allowed!',
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Batas ukuran file 100MB (sesuaikan jika perlu)
});

exports.uploadVideos = upload.fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
]);

// Get all Ipvideo entries
exports.getAllIpvideos = catchAsync(async (req, res, next) => {
  const ipvideos = await Ipvideo.findAll({});

  res.status(200).json({
    status: 'success',
    results: ipvideos.length,
    data: ipvideos,
  });
});

// Create a new Ipvideo entry
exports.createIpvideo = catchAsync(async (req, res, next) => {
  const { video1: video1Url, video2: video2Url } = req.body;
  const files = req.files || {};

  // Video1: Gunakan file jika ada, fallback ke URL dari body
  let video1 = video1Url;
  if (files.file1) {
    const result = await cloudinaryUpload(files.file1[0].buffer);
    video1 = result.secure_url;
  }
  if (!video1) return next(new AppError('Video1 is required!', 400));

  // Video2: Gunakan file jika ada, fallback ke URL dari body
  let video2 = video2Url;
  if (files.file2) {
    const result = await cloudinaryUpload(files.file2[0].buffer);
    video2 = result.secure_url;
  }
  if (!video2) return next(new AppError('Video2 is required!', 400));

  const ipvideo = await Ipvideo.create({
    video1,
    video2,
  });

  res.status(201).json({
    status: 'success',
    data: { ipvideo },
  });
});

// Update an existing Ipvideo entry
exports.updateIpvideo = catchAsync(async (req, res, next) => {
  const { video1: video1Url, video2: video2Url } = req.body;
  const files = req.files || {};

  const ipvideo = await Ipvideo.findByPk(req.params.id);
  if (!ipvideo)
    return next(new AppError('No document found with that ID', 404));

  // Video1: Gunakan file baru jika ada, atau URL dari body, atau biarkan yang lama
  if (files.file1) {
    const result = await cloudinaryUpload(
      files.file1[0].buffer,
      ipvideo.video1 ? ipvideo.video1.split('/').pop().split('.')[0] : null
    );
    ipvideo.video1 = result.secure_url;
  } else if (video1Url) {
    ipvideo.video1 = video1Url;
  }

  // Video2: Gunakan file baru jika ada, atau URL dari body, atau biarkan yang lama
  if (files.file2) {
    const result = await cloudinaryUpload(
      files.file2[0].buffer,
      ipvideo.video2 ? ipvideo.video2.split('/').pop().split('.')[0] : null
    );
    ipvideo.video2 = result.secure_url;
  } else if (video2Url) {
    ipvideo.video2 = video2Url;
  }

  await ipvideo.save();

  res.status(200).json({
    status: 'success',
    data: ipvideo,
  });
});

// Get a single Ipvideo entry by ID
exports.getIpvideo = catchAsync(async (req, res, next) => {
  const ipvideo = await Ipvideo.findByPk(req.params.id);
  if (!ipvideo)
    return next(new AppError('No document found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: ipvideo,
  });
});

// Delete an Ipvideo entry by ID
exports.deleteIpvideo = catchAsync(async (req, res, next) => {
  const ipvideo = await Ipvideo.findByPk(req.params.id);
  if (!ipvideo)
    return next(new AppError('No document found with that ID', 404));

  // Hapus video dari Cloudinary jika ada
  if (ipvideo.video1) {
    const publicId = ipvideo.video1.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`teatersatu/images/${publicId}`);
  }
  if (ipvideo.video2) {
    const publicId = ipvideo.video2.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`teatersatu/images/${publicId}`);
  }

  await ipvideo.destroy();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
