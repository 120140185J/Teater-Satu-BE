const express = require('express');
const lpanggotautamaController = require('../controllers/lpanggotautamaController');

const router = express.Router();

router
  .route('/')
  .get(lpanggotautamaController.getAllLpanggotautama)
  .post(lpanggotautamaController.createLpanggotautama);

router
  .route('/:id')
  .get(lpanggotautamaController.getLpanggotautama)
  .patch(lpanggotautamaController.updateLpanggotautama)
  .delete(lpanggotautamaController.deleteLpanggotautama);

module.exports = router;

// get
// post
// patch
// delete
