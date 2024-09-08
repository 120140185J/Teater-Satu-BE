const express = require('express');
const lpberitaController = require('../controllers/lpberitaController');

const router = express.Router();

router
  .route('/')
  .get(lpberitaController.getAllLpberita)
  .post(lpberitaController.uploadLpberitaPhoto, lpberitaController.createLpberita);

router
  .route('/:id')
  .get(lpberitaController.getLpberita)
  .patch(lpberitaController.uploadLpberitaPhoto, lpberitaController.updateLpberita)
  .delete(lpberitaController.deleteLpberita);

module.exports = router;
