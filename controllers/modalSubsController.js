const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');
const ModalSubs = require('../models/modalSubsModel');
require('dotenv').config();

const upload = multer({ storage: multer.memoryStorage() });

exports.uploadModalSubsPhoto = upload.single('imageUrl');

exports.getAllModalSubs = catchAsync(async (req, res) => {
  const modalSubs = await ModalSubs.findAll();
  res.status(200).json({ status: 'success', data: modalSubs });
});

exports.createModalSubs = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title?.trim()) return next(new AppError('Title is required', 400));
  const imageUrl = req.file
    ? (await fileHelper.upload(req.file.buffer)).secure_url
    : '';
  const newModalSubs = await ModalSubs.create({
    title: title.trim(),
    description: description?.trim() || null,
    imageUrl,
  });
  res.status(201).json({ status: 'success', data: newModalSubs });
});

exports.updateModalSubs = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;
  const modalSubs = await ModalSubs.findByPk(req.params.id);
  if (!modalSubs) return next(new AppError('No document found', 404));

  if (title?.trim()) modalSubs.title = title.trim();
  if (description) modalSubs.description = description.trim() || null;
  if (req.file)
    modalSubs.imageUrl = (
      await fileHelper.upload(req.file.buffer, modalSubs.imageUrl)
    ).secure_url;

  await modalSubs.save();
  res.status(200).json({ status: 'success', data: modalSubs });
});

exports.getModalSubs = catchAsync(async (req, res, next) => {
  const modalSubs = await ModalSubs.findByPk(req.params.id);
  if (!modalSubs) return next(new AppError('No document found', 404));
  res.status(200).json({ status: 'success', data: modalSubs });
});

exports.deleteModalSubs = catchAsync(async (req, res, next) => {
  const modalSubs = await ModalSubs.findByPk(req.params.id);
  if (!modalSubs) return next(new AppError('No document found', 404));
  await modalSubs.destroy();
  res.status(200).json({ status: 'success', message: 'Deleted' });
});
