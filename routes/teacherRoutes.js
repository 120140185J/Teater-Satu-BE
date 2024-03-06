const express = require('express');

const router = express.Router();

const teacherController = require('../controllers/teacherController');

router
  .route('/')
  .get(teacherController.getAllTeachers)
  .post(teacherController.uploadGuruPhoto, teacherController.createTeacher);

router
  .route('/:id')
  .get(teacherController.getTeacher)
  .patch(teacherController.uploadGuruPhoto, teacherController.updateTeacher)
  .delete(teacherController.deleteTeacher);

module.exports = router;
