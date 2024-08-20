const express = require('express');
const beritapatnerController = require('../controllers/beritapatnerController');

const router = express.Router();

router
  .route('/')
  .get(beritapatnerController.getAllBeritaPatner)
  .post(
    beritapatnerController.uploadBeritaPatnerPhoto,
    beritapatnerController.createBeritaPatner
  );

router
  .route('/:id')
  .get(beritapatnerController.getBeritaPatner)
  .patch(
    beritapatnerController.uploadBeritaPatnerPhoto,
    beritapatnerController.updateBeritaPatner
  )
  .delete(beritapatnerController.deleteBeritaPatner);

module.exports = router;
