const express = require('express');
const tiketController = require('../controllers/tiketController');

const router = express.Router();

router
  .route('/')
  .get(tiketController.getAllTiket)
  .post(tiketController.createTiket);

router
  .route('/:id')
  .get(tiketController.getTiket)
  .put(tiketController.updateTiket)
  .delete(tiketController.deleteTiket);

module.exports = router;
