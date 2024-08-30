const express = require('express');
const subsvideoController = require('../controllers/subsvideoController');

const router = express.Router();

router
  .route('/')
  .get(subsvideoController.getAllSubsvideo)
  .post(subsvideoController.uploadSubsvideoPhoto, subsvideoController.createSubsvideo);

router
  .route('/:id')
  .get(subsvideoController.getSubsvideo)
  .patch(subsvideoController.uploadSubsvideoPhoto, subsvideoController.updateSubsvideo)
  .delete(subsvideoController.deleteSubsvideo);

module.exports = router;
