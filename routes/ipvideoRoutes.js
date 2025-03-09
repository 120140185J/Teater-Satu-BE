const express = require('express');
const ipvideoController = require('../controllers/ipvideoController');

const router = express.Router();

router
  .route('/')
  .get(ipvideoController.getAllIpvideos)
  .post(ipvideoController.uploadVideos, ipvideoController.createIpvideo);

router
  .route('/:id')
  .get(ipvideoController.getIpvideo)
  .patch(ipvideoController.uploadVideos, ipvideoController.updateIpvideo)
  .delete(ipvideoController.deleteIpvideo);

module.exports = router;
