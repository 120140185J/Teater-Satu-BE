const express = require('express');
const lpkolaborasiController = require('../controllers/lpkolaborasiController');

const router = express.Router();

router
  .route('/')
  .get(lpkolaborasiController.getAllLpkolaborasi)
  .post(lpkolaborasiController.uploadLpkolaborasiPhoto, lpkolaborasiController.createLpkolaborasi);

router
  .route('/:id')
  .get(lpkolaborasiController.getLpkolaborasi)
  .patch(lpkolaborasiController.uploadLpkolaborasiPhoto, lpkolaborasiController.updateLpkolaborasi)
  .delete(lpkolaborasiController.deleteLpkolaborasi);

module.exports = router;
