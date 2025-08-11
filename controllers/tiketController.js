/* eslint-disable camelcase */
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');
const Tiket = require('../models/tiketModel');
const HistoryBuyTiket = require('../models/historyBuyTiketModel');
const User = require('../models/userModel');
require('dotenv').config();

exports.getAllTiket = catchAsync(async (req, res, next) => {
  const tiket = await Tiket.findAll({
    where: { tampilkan: true },
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    status: 'success',
    results: tiket.length,
    data: tiket,
  });
});

exports.getAllTiketAdmin = catchAsync(async (req, res, next) => {
  const tiket = await Tiket.findAll({
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    status: 'success',
    results: tiket.length,
    data: tiket,
  });
});

exports.createTiket = catchAsync(async (req, res, next) => {
  const {
    nama_pertujukan,
    tanggal_pertujukan,
    tempat_pertujukan,
    harga_tiket,
    tanggal_mulai_penjualan,
    tanggal_selesai_penjualan,
    nama_kategori_tiket,
    harga_kategori_tiket,
    jumlah_stok_tiket,
    tampilkan,
  } = req.body;

  if (
    !nama_pertujukan ||
    !tanggal_pertujukan ||
    !tempat_pertujukan ||
    !harga_tiket ||
    !tanggal_mulai_penjualan ||
    !tanggal_selesai_penjualan ||
    !jumlah_stok_tiket
  ) {
    return next(new AppError('Please provide all required fields', 400));
  }

  const tiket = await Tiket.create({
    nama_pertujukan,
    tanggal_pertujukan,
    tempat_pertujukan,
    harga_tiket,
    tanggal_mulai_penjualan,
    tanggal_selesai_penjualan,
    nama_kategori_tiket,
    harga_kategori_tiket,
    jumlah_stok_tiket,
    tampilkan: typeof tampilkan === 'boolean' ? tampilkan : true,
  });

  res.status(201).json({
    status: 'success',
    data: tiket,
  });
});

exports.updateTiket = catchAsync(async (req, res, next) => {
  const {
    nama_pertujukan,
    tanggal_pertujukan,
    tempat_pertujukan,
    harga_tiket,
    tanggal_mulai_penjualan,
    tanggal_selesai_penjualan,
    nama_kategori_tiket,
    harga_kategori_tiket,
    jumlah_stok_tiket,
    tampilkan,
  } = req.body;

  const tiket = await Tiket.findByPk(req.params.id);

  if (!tiket) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  if (nama_pertujukan) tiket.nama_pertujukan = nama_pertujukan;
  if (tanggal_pertujukan) tiket.tanggal_pertujukan = tanggal_pertujukan;
  if (tempat_pertujukan) tiket.tempat_pertujukan = tempat_pertujukan;
  if (harga_tiket) tiket.harga_tiket = harga_tiket;
  if (tanggal_mulai_penjualan)
    tiket.tanggal_mulai_penjualan = tanggal_mulai_penjualan;
  if (tanggal_selesai_penjualan)
    tiket.tanggal_selesai_penjualan = tanggal_selesai_penjualan;
  if (nama_kategori_tiket) tiket.nama_kategori_tiket = nama_kategori_tiket;
  if (harga_kategori_tiket) tiket.harga_kategori_tiket = harga_kategori_tiket;
  if (jumlah_stok_tiket) tiket.jumlah_stok_tiket = jumlah_stok_tiket;
  if (typeof tampilkan === 'boolean') tiket.tampilkan = tampilkan;

  await tiket.save();

  res.status(200).json({
    status: 'success',
    data: tiket,
  });
});

exports.patchTiket = catchAsync(async (req, res, next) => {
  const { tampilkan } = req.body;

  if (typeof tampilkan !== 'boolean') {
    return next(
      new AppError('Please provide a boolean value for tampilkan', 400)
    );
  }

  const tiket = await Tiket.findByPk(req.params.id);

  if (!tiket) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  tiket.tampilkan = tampilkan;
  await tiket.save();

  res.status(200).json({
    status: 'success',
    data: tiket,
  });
});

exports.getTiket = catchAsync(async (req, res, next) => {
  const tiket = await Tiket.findByPk(req.params.id);

  if (!tiket) {
    return next(new AppError('Akun tidak dapat ditemukan atau konten tidak ada', 404));
  }

  res.status(200).json({
    status: 'success',
    data: tiket,
  });
});

exports.deleteTiket = handlerFactory.deleteOne(Tiket);

exports.buyTiketUser = catchAsync(async (req, res, next) => {
  const { nama_user, no_telp, id_tiket, jumlah_tiket, id_user } = req.body;

  if (!id_user) {
    return next(new AppError('Please login first', 401));
  }

  if (!nama_user || !no_telp || !id_tiket || !jumlah_tiket) {
    return next(new AppError('Please provide all required fields', 400));
  }

  const tiket = await Tiket.findByPk(id_tiket);

  if (!tiket) {
    return next(new AppError('No ticket found with that ID', 404));
  }

  if (tiket.tampilkan === false) {
    return next(new AppError('This ticket is not available for sale', 400));
  }

  if (tiket.jumlah_stok_tiket < jumlah_tiket) {
    return next(new AppError('Not enough stock', 400));
  }

  tiket.jumlah_stok_tiket -= jumlah_tiket;
  await tiket.save();

  await HistoryBuyTiket.create({
    nama_user,
    no_telp,
    id_tiket,
    jumlah_tiket,
    id_user,
  });

  res.status(200).json({
    status: 'success',
    message: 'Tiket berhasil dibeli',
  });
});

exports.getHistoryTiketUser = catchAsync(async (req, res, next) => {
  console.log('Accessing getHistoryTiketUser with id_user:', req.query.id_user);
  if (!req.query.id_user) {
    return next(new AppError('Please provide id_user', 400));
  }

  const historyBuyTiket = await HistoryBuyTiket.findAll({
    order: [['createdAt', 'DESC']],
    where: {
      id_user: req.query.id_user,
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'subscription_time'],
      },
      {
        model: Tiket,
        as: 'tiket',
      },
    ],
  });

  console.log('History found:', historyBuyTiket);
  res.status(200).json({
    status: 'success',
    results: historyBuyTiket.length,
    data: historyBuyTiket,
  });
});

exports.getAllHistoryTiket = catchAsync(async (req, res, next) => {
  const historyBuyTiket = await HistoryBuyTiket.findAll({
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'subscription_time'],
      },
      {
        model: Tiket,
        as: 'tiket',
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: historyBuyTiket.length,
    data: historyBuyTiket,
  });
});

exports.getHistoryTiketByTiketId = catchAsync(async (req, res, next) => {
  console.log(
    'Accessing getHistoryTiketByTiketId with id_tiket:',
    req.query.id_tiket
  );
  if (!req.query.id_tiket) {
    return next(new AppError('Please provide id_tiket', 400));
  }

  const historyBuyTiket = await HistoryBuyTiket.findAll({
    order: [['createdAt', 'DESC']],
    where: {
      id_tiket: req.query.id_tiket,
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'subscription_time'],
      },
      {
        model: Tiket,
        as: 'tiket',
      },
    ],
  });

  console.log('History found for tiket:', historyBuyTiket);
  res.status(200).json({
    status: 'success',
    results: historyBuyTiket.length,
    data: historyBuyTiket,
  });
});

exports.updateConfirmationStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { is_confirmed } = req.body;

  if (typeof is_confirmed !== 'boolean') {
    return next(
      new AppError('Please provide a boolean value for is_confirmed', 400)
    );
  }

  const history = await HistoryBuyTiket.findByPk(id);

  if (!history) {
    return next(new AppError('No history found with that ID', 404));
  }

  history.is_confirmed = is_confirmed;
  await history.save();

  res.status(200).json({
    status: 'success',
    data: history,
  });
});
