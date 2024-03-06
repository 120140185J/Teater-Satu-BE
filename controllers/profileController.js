const multer = require('multer');
const Profile = require('../models/profileModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadProfilePhoto = upload.single('photo');

exports.getAllProfile = factory.getAll(Profile);
exports.getProfile = factory.getOne(Profile);
exports.createProfile = catchAsync(async (req, res, next) => {
  const data = req.body;
  const { file } = req;

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    data.photo = uploadedFile.secure_url;
  }

  const profile = await Profile.create(data);

  res.status(201).json({
    status: 'success',
    data: {
      profile,
    },
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const data = req.body;
  const { file } = req;

  // Find the berita record by ID
  const profile = await Profile.findByPk(req.params.id);

  if (!profile) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (file) {
    const uploadedFile = await fileHelper.upload(
      file.buffer,
      profile.photo_url
    );
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    data.photo = uploadedFile.secure_url;
  }

  await profile.update(data);

  res.status(200).json({
    status: 'success',
    data: profile,
  });
});

exports.deleteProfile = factory.deleteOne(Profile);
