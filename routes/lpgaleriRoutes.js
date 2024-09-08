const express = require('express');
const lpgaleriController = require('../controllers/lpgaleriController');

const router = express.Router();

router
  .route('/')
  .get(lpgaleriController.getAllLpgaleri)
  .post(lpgaleriController.createLpgaleri);

router
  .route('/:id')
  .get(lpgaleriController.getLpgaleri)
  .patch(lpgaleriController.updateLpgaleri)
  .delete(lpgaleriController.deleteLpgaleri);

module.exports = router;

// get
// post
// patch
// delete
