const express = require('express');
const kategoriController = require('../controllers/kategoriController');

const router = express.Router();

router
  .route('/')
  .get(kategoriController.getAllKategori)
  .post(kategoriController.createKategori);

router
  .route('/:id')
  .get(kategoriController.getKategori)
  .patch(kategoriController.updateKategori)
  .delete(kategoriController.deleteKategori);

module.exports = router;
