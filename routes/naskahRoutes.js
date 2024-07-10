const express = require('express');
const naskah = require('../controllers/naskahController');

const router = express.Router();

router
  .route('/')
  .get(naskah.getAllNaskah)
  .post(naskah.uploadNaskahPhoto, naskah.createNaskah);

router
  .route('/:id')
  .get(naskah.getNaskah)
  .patch(naskah.uploadNaskahPhoto, naskah.updateNaskah)
  .delete(naskah.deleteNaskah);

module.exports = router;
