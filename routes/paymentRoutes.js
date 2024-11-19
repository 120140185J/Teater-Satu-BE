const express = require('express');

const router = express.Router();
const paymentcController = require("../controllers/paymentController");

router.route("/").get(paymentcController.getAllHistoryPayment);
router.route("/").post(paymentcController.createToken);
router.route("/webhook").post(paymentcController.webhook);

module.exports = router;