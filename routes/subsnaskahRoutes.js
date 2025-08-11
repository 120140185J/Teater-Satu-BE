const express = require('express');
const subsnaskahController = require('../controllers/subsnaskahController');

const router = express.Router();

// Semua middleware otentikasi (authController.protect) telah dihapus.

router
  .route('/')
  .get(subsnaskahController.getAllSubsnaskah)
  // Middleware upload file dari controller tetap diperlukan untuk memproses file
  .post(
    subsnaskahController.uploadSubsnaskahFiles,
    subsnaskahController.createSubsnaskah
  );

// Route untuk download harus didefinisikan sebelum route '/:id'
router.route('/:id/download').get(subsnaskahController.downloadNaskah);

router
  .route('/:id')
  .get(subsnaskahController.getSubsnaskah)
  .patch(
    subsnaskahController.uploadSubsnaskahFiles,
    subsnaskahController.updateSubsnaskah
  )
  .delete(subsnaskahController.deleteSubsnaskah);

module.exports = router;
