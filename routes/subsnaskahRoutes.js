const express = require('express');
const subsnaskah = require('../controllers/subsnaskahController');

const router = express.Router();
router
  .route('/')
  .get(subsnaskah.getAllSubsnaskah)
  .post(subsnaskah.uploadSubsnaskahPhoto, subsnaskah.createSubsnaskah);

router
  .route('/:id')
  .get(subsnaskah.getSubsnaskah)
  .patch(subsnaskah.uploadSubsnaskahPhoto, subsnaskah.updateSubsnaskah)
  .delete(subsnaskah.deleteSubsnaskah);

module.exports = router;
