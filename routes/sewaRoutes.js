const express = require('express');
const sewaController = require('../controllers/sewaController');

const router = express.Router();

router
  .route('/')
  .get(sewaController.getAllSewa)
  .post(sewaController.uploadSewaPhoto, sewaController.createSewa);

router
  .route('/:id')
  .get(sewaController.getSewa)
  .patch(sewaController.uploadSewaPhoto, sewaController.updateSewa)
  .delete(sewaController.deleteSewa);

module.exports = router;
