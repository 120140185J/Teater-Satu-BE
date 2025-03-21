const express = require('express');

const router = express.Router();
const paymentcController = require("../controllers/paymentController");

router.route("/").get(paymentcController.getAllHistoryPayment);
router.route("/").post(paymentcController.createToken);
router.route("/webhook").post(paymentcController.webhook);
router.route("/webhook-ticket").post(paymentcController.webhookTicket);
router.route("/history-subscription-user").get(paymentcController.getHistoryPaymentByIdUser);

module.exports = router;