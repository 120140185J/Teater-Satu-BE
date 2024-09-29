const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fileHelper = require('../utils/fileHelper');

const Product = require('../models/productModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadProductPhoto = upload.single('gambar_product');

exports.getAllProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findAll();

  res.status(200).json({
    status: 'success',
    results: product.length,
    data: product,
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { nama, tersedia, harga, quantity, deskripsi, status } = req.body;
  const { file } = req;

  let url = '';

  if (file) {
    const uploadedFile = await fileHelper.upload(file.buffer);
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    url = uploadedFile.secure_url;
  }

  const product = await Product.create({
    nama,
    tersedia,
    harga,
    quantity,
    deskripsi,
    status,
    gambar_product: url,
  });

  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { nama, tersedia, harga, quantity, deskripsi, status } = req.body;
  const { file } = req;

  // Find the berita record by ID
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the berita record with the new data
  if (nama) product.nama = nama;
  if (tersedia) product.tersedia = tersedia;
  if (harga) product.harga = harga;
  if (quantity) product.quantity = quantity;
  if (deskripsi) product.deskripsi = deskripsi;
  if (status) product.status = status;

  if (file) {
    const uploadedFile = await fileHelper.upload(
      file.buffer,
      product.photo_url
    );
    if (!uploadedFile) {
      return next(new AppError('Error uploading file', 400));
    }

    product.gambar_product = uploadedFile.secure_url;
  }

  await product.save();

  res.status(200).json({
    status: 'success',
    data: product,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: product,
  });
});

exports.deleteProduct = handlerFactory.deleteOne(Product);
