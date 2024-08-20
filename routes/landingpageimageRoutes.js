const express = require('express');
const landingpageimageController = require('../controllers/landingpageimageController');

const router = express.Router();

router
  .route('/')
  .get(landingpageimageController.getAllLandingpageimage)
  .post(landingpageimageController.createLandingpageimage);

router
  .route('/:id')
  .get(landingpageimageController.getLandingpageimage)
  .patch(landingpageimageController.updateLandingpageimage)
  .delete(landingpageimageController.deleteLandingpageimage);

module.exports = router;

// get
// post
// patch
// delete
