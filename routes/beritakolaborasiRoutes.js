const express = require('express');
const beritakolaborasiController = require('../controllers/beritaKolaborasiController');

const router = express.Router();

router
  .route('/')
  .get(beritakolaborasiController.getAllBeritaKolaborasi)
  .post(
    beritakolaborasiController.uploadBeritaKolaborasiPhotos,
    beritakolaborasiController.createBeritaKolaborasi
  );

router
  .route('/:id')
  .get(beritakolaborasiController.getBeritaKolaborasi)
  .patch(
    beritakolaborasiController.uploadBeritaKolaborasiPhotos,
    beritakolaborasiController.updateBeritaKolaborasi
  )
  .delete(beritakolaborasiController.deleteBeritaKolaborasi);

module.exports = router;
