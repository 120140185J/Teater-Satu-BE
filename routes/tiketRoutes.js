const express = require('express');
const tiketController = require('../controllers/tiketController');

const router = express.Router();

router.route('/user/pesan').post(tiketController.buyTiketUser);

router.route('/user/history').get(tiketController.getHistoryTiketUser);

router.route('/history').get(tiketController.getAllHistoryTiket);

router.route('/history/tiket').get(tiketController.getHistoryTiketByTiketId);

router
  .route('/history/confirm/:id')
  .patch(tiketController.updateConfirmationStatus);

router
  .route('/')
  .get(tiketController.getAllTiket)
  .post(tiketController.createTiket);

router
  .route('/:id')
  .get(tiketController.getTiket)
  .put(tiketController.updateTiket)
  .patch(tiketController.patchTiket)
  .delete(tiketController.deleteTiket);

module.exports = router;
