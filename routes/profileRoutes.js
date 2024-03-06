const express = require('express');

const router = express.Router();

const profileController = require('../controllers/profileController');

router
  .route('/')
  .get(profileController.getAllProfile)
  .post(profileController.uploadProfilePhoto, profileController.createProfile);

router
  .route('/:id')
  .get(profileController.getProfile)
  .patch(profileController.uploadProfilePhoto, profileController.updateProfile)
  .delete(profileController.deleteProfile);

module.exports = router;
