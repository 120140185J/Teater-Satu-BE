const express = require('express');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// Route untuk data ringkasan (kartu statistik)
router.get('/summary', analyticsController.getSummaryData);

// Route untuk data grafik tren pendapatan
router.get('/revenue-trend', analyticsController.getRevenueTrend);

module.exports = router;
