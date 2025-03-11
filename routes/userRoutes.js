const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/subscription', authController.subscription);
router.post('/update-password', authController.updatePassword);

router.patch(
  '/update-photo/:id',
  userController.uploadUserPhoto,
  userController.updateUserPhoto
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.uploadUserPhoto, userController.createUser); // Tambahkan uploadUserPhoto

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
