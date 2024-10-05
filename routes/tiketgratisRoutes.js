const express = require('express');
const tiketgratis = require('../controllers/tiketgratisController');

const router = express.Router();

router
  .route('/')
  .get(tiketgratis.getAllTiketgratis)
  .post(tiketgratis.uploadTiketgratisPhoto, tiketgratis.createTiketgratis);

router
  .route('/:id')
  .get(tiketgratis.getTiketgratis)
  .patch(tiketgratis.uploadTiketgratisPhoto, tiketgratis.updateTiketgratis)
  .delete(tiketgratis.deleteTiketgratis);

module.exports = router;
