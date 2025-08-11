const { Op, fn, col } = require('sequelize');
const User = require('../models/userModel');
const Paymenthistory = require('../models/paymenthistoryModel');
const catchAsync = require('../utils/catchAsync');

/**
 * Mengambil data ringkasan untuk kartu statistik di dashboard.
 */
exports.getSummaryData = catchAsync(async (req, res, next) => {
  // --- Menghitung Periode Waktu ---
  const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // --- Melakukan Semua Query ke Database ---

  // 1. Total Pendapatan (30 hari terakhir)
  const totalPendapatan = await Paymenthistory.sum('gross_amount', {
    where: {
      transaction_status: 'settlement',
      createdAt: { [Op.gte]: thirtyDaysAgo },
    },
  });

  // 2. Pelanggan Aktif
  const pelangganAktif = await User.count({
    where: {
      subscription_time: { [Op.ne]: null, [Op.gt]: new Date() },
    },
  });

  // 3. Total semua akun yang terdaftar
  const totalAkun = await User.count();

  // 4. Total transaksi yang terjadi HARI INI
  const transaksiHariIni = await Paymenthistory.count({
    where: {
      transaction_status: 'settlement',
      createdAt: { [Op.gte]: todayStart },
    },
  });

  // --- Mengirim Satu Respons JSON ---

  res.status(200).json({
    status: 'success',
    data: {
      totalPendapatan: totalPendapatan || 0,
      pelangganAktif: pelangganAktif || 0,
      totalAkun: totalAkun || 0,
      transaksiHariIni: transaksiHariIni || 0,
    },
  });
});

/**
 * Mengambil data untuk grafik tren pendapatan harian.
 */
exports.getRevenueTrend = catchAsync(async (req, res, next) => {
  const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));

  const revenueData = await Paymenthistory.findAll({
    attributes: [
      [fn('DATE', col('createdAt')), 'tanggal'],
      [fn('SUM', col('gross_amount')), 'total'],
    ],
    where: {
      transaction_status: 'settlement',
      createdAt: { [Op.gte]: thirtyDaysAgo },
    },
    group: [fn('DATE', col('createdAt'))],
    order: [[fn('DATE', col('createdAt')), 'ASC']],
  });

  // Format data agar mudah dibaca oleh library grafik
  const labels = revenueData.map((item) =>
    new Date(item.get('tanggal')).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
    })
  );
  const values = revenueData.map((item) => item.get('total'));

  res.status(200).json({
    status: 'success',
    data: {
      labels,
      values,
    },
  });
});
