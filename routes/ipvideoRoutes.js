const express = require('express');
const ipvideoController = require('../controllers/ipvideoController');

const router = express.Router();

router
  .route('/')
  .get(ipvideoController.getAllIpvideos) // Mengambil semua data Ipvideo
  .post(ipvideoController.createIpvideo); // Membuat data Ipvideo baru

router
  .route('/:id')
  .get(ipvideoController.getIpvideo) // Mengambil data Ipvideo berdasarkan ID
  .patch(ipvideoController.updateIpvideo) // Memperbarui data Ipvideo berdasarkan ID
  .delete(ipvideoController.deleteIpvideo); // Menghapus data Ipvideo berdasarkan ID

module.exports = router;