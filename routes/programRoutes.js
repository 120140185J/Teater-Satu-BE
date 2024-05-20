const express = require('express');
const programController = require('../controllers/programController');

const router = express.Router();

router
  .route('/')
  .get(programController.getAllProgram)
  .post(programController.uploadProgramPhoto, programController.createProgram);

router
  .route('/:id')
  .get(programController.getProgram)
  .patch(programController.uploadProgramPhoto, programController.updateProgram)
  .delete(programController.deleteProgram);

module.exports = router;
