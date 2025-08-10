const express = require('express');

const router = express.Router();
const modalSubsController = require('../controllers/modalSubsController');

router
  .route('/')
  .get(modalSubsController.getAllModalSubs)
  .post(
    modalSubsController.uploadModalSubsPhoto,
    modalSubsController.createModalSubs
  );

router
  .route('/:id')
  .get(modalSubsController.getModalSubs)
  .patch(
    modalSubsController.uploadModalSubsPhoto,
    modalSubsController.updateModalSubs
  )
  .delete(modalSubsController.deleteModalSubs);

module.exports = router;
