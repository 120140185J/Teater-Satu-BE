const express = require('express');
const beritakolaborasiController = require('../controllers/beritaKolaborasiController');

const router = express.Router();

router
  .route('/')
  .get(beritakolaborasiController.getAllBeritaKolaborasi)
  .post(
    beritakolaborasiController.uploadBeritaKolaborasiPhoto,
    beritakolaborasiController.createBeritaKolaborasi
  );

router
  .route('/:id')
  .get(beritakolaborasiController.getBeritaKolaborasi)
  .patch(
    beritakolaborasiController.uploadBeritaKolaborasiPhoto,
    beritakolaborasiController.updateBeritaKolaborasi
  )
  .delete(beritakolaborasiController.deleteBeritaKolaborasi);

module.exports = router;
