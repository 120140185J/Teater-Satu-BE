const express = require('express');
const classController = require('../controllers/classController');

const router = express.Router();

router
  .route('/')
  .get(classController.getAllClasses)
  .post(classController.createClass);

router
  .route('/:id')
  .get(classController.getClass)
  .patch(classController.updateClass)
  .delete(classController.deleteClass);

module.exports = router;
