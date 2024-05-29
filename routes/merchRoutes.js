const express = require('express');
const merchController = require('../controllers/merchController');

const router = express.Router();

router
  .route('/')
  .get(merchController.getAllMerch)
  .post(merchController.uploadMerchPhoto, merchController.createMerch);

router
  .route('/:id')
  .get(merchController.getMerch)
  .patch(merchController.uploadMerchPhoto, merchController.updateMerch)
  .delete(merchController.deleteMerch);

module.exports = router;
