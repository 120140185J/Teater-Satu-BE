const express = require('express');
const subsgaleri = require('../controllers/subsgaleriController');

const router = express.Router();
router
  .route('/')
  .get(subsgaleri.getAllSubsgaleri)
  .post(subsgaleri.uploadSubsgaleriPhoto, subsgaleri.createSubsgaleri);

router
  .route('/:id')
  .get(subsgaleri.getSubGaleri)
  .patch(subsgaleri.uploadSubsgaleriPhoto, subsgaleri.updateSubsgaleri)
  .delete(subsgaleri.deleteSubsgaleri);

router.route('/temp/:id_subs_galeri').delete(subsgaleri.deleteTempSubsgaleri);

module.exports = router;
