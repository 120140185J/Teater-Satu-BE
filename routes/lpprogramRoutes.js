const express = require('express');
const lpprogramController = require('../controllers/lpprogramController');

const router = express.Router();

router
  .route('/')
  .get(lpprogramController.getAllLpprogram)
  .post(lpprogramController.uploadLpprogramPhoto, lpprogramController.createLpprogram);

router
  .route('/:id')
  .get(lpprogramController.getLpprogram)
  .patch(lpprogramController.uploadLpprogramPhoto, lpprogramController.updateLpprogram)
  .delete(lpprogramController.deleteLpprogram);

module.exports = router;
