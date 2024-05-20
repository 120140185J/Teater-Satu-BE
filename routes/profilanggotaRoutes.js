const express = require('express');

const router = express.Router();

const profilanggotaController = require('../controllers/profilanggotaController');

router
  .route('/')
  .get(profilanggotaController.getAllProfilanggota)
  .post(
    profilanggotaController.uploadProfilanggotaPhoto,
    profilanggotaController.createProfilanggota
  );

router
  .route('/:id')
  .get(profilanggotaController.getProfileanggota)
  .patch(
    profilanggotaController.uploadProfilanggotaPhoto,
    profilanggotaController.updateProfilanggota
  )
  .delete(profilanggotaController.deleteProfilanggota);

module.exports = router;
