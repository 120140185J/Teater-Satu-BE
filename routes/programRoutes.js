const express = require('express');
const programController = require('../controllers/programController');

const router = express.Router();

router
  .route('/')
  .get(programController.getAllProgram)
  .post(programController.uploadProgramPhotos, programController.createProgram);

router
  .route('/:id')
  .get(programController.getProgram)
  .patch(programController.uploadProgramPhotos, programController.updateProgram)
  .delete(programController.deleteProgram);

module.exports = router;
