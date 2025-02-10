const express = require("express");
const PaymentController = require("../controllers/PaymentController");

const router = express.Router();

router.post("/create-payment", PaymentController.createPayment);
router.post("/ipn", PaymentController.handleIPN);
module.exports = router;
