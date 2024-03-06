const multer = require('multer');
const Teacher = require('../models/teacherModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadGuruPhoto = upload.single('photo');

exports.getAllTeachers = factory.getAll(Teacher);
exports.getTeacher = factory.getOne(Teacher);
exports.createTeacher = catchAsync(async (req, res, next) => {
  const data = req.body;
  const { file } = req;

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    data.photo = uploadedFile.secure_url;
  }

  const teacher = await Teacher.create(data);

  res.status(201).json({
    status: 'success',
    data: {
      teacher,
    },
  });
});

exports.updateTeacher = catchAsync(async (req, res, next) => {
  const data = req.body;
  const { file } = req;

  // Find the berita record by ID
  const teacher = await Teacher.findByPk(req.params.id);

  if (!teacher) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (file) {
    const uploadedFile = await fileHelper.upload(
      file.buffer,
      teacher.photo_url
    );
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    data.photo = uploadedFile.secure_url;
  }

  await teacher.update(data);

  res.status(200).json({
    status: 'success',
    data: teacher,
  });
});

exports.deleteTeacher = factory.deleteOne(Teacher);
