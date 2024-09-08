const express = require('express');
const lptestimoniController = require('../controllers/lptestimoniController');

const router = express.Router();

router
  .route('/')
  .get(lptestimoniController.getAllLptestimoni)
  .post(lptestimoniController.uploadLptestimoniPhoto, lptestimoniController.createLptestimoni);

router
  .route('/:id')
  .get(lptestimoniController.getLptestimoni)
  .patch(lptestimoniController.uploadLptestimoniPhoto, lptestimoniController.updateLptestimoni)
  .delete(lptestimoniController.deleteLptestimoni);

module.exports = router;
