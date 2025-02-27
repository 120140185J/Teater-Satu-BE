const express = require('express');
const donasiController = require('../controllers/donasiController');

const router = express.Router();

router
  .route('/')
  .get(donasiController.getAllDonasi)
  .post(
    donasiController.uploadDonasiPhotos,
    donasiController.createDonasi
  );

router
  .route('/:id')
  .get(donasiController.getDonasi)
  .patch(
    donasiController.uploadDonasiPhotos,
    donasiController.updateDonasi
  )
  .delete(donasiController.deleteDonasi);

module.exports = router;
