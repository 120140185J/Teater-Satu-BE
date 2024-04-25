const express = require('express');
const beritaController = require('../controllers/galeriController');

const router = express.Router();

router
  .route('/')
  .get(beritaController.getAllGaleri)
  .post(beritaController.uploadGaleriPhoto, beritaController.createGaleri);

router
  .route('/:id')
  .get(beritaController.getGaleri)
  .patch(beritaController.uploadGaleriPhoto, beritaController.updateGaleri)
  .delete(beritaController.deleteGaleri);

module.exports = router;
