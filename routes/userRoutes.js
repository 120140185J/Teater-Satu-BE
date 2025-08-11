const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// --- Rute Otentikasi ---
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// [TAMBAHAN] Rute baru untuk login dengan Google OAuth
router.post('/login-google', authController.loginGoogle);

// --- Rute CRUD User (biasanya perlu proteksi admin) ---
// Disarankan untuk menambahkan proteksi di sini di masa depan
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.uploadUserPhoto, userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.uploadUserPhoto, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
