const { MoMoService, momoConfig } = require("../services/MoMoService");

class PaymentController {
  static async createPayment(req, res) {
    try {
      const { amount, orderId } = req.body;
      const requestId = `${orderId}-${Date.now()}`;
      const orderInfo = "Thanh toán đơn hàng MoMo";

      const payload = {
        partnerCode: momoConfig.partnerCode,
        accessKey: momoConfig.accessKey,
        requestId,
        amount: amount.toString(),
        orderId,
        orderInfo,
        redirectUrl: momoConfig.redirectUrl,
        ipnUrl: momoConfig.ipnUrl,
        extraData: "",
        requestType: "captureWallet",
      };

      payload.signature = MoMoService.createSignature(payload);

      const requestBody = JSON.stringify(payload);
      console.log("Payload being sent:", requestBody);

      const response = await MoMoService.sendPaymentRequest(requestBody);
      console.log("Response from MoMo:", response);

      if (response.resultCode === 0) {
        res.status(200).json({
          message: "Payment created successfully",
          payUrl: response.payUrl,
        });
      } else {
        res.status(400).json({
          message: "Failed to create payment",
          error: response.message,
        });
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static handleIPN(req, res) {
    try {
      const {
        partnerCode,
        orderId,
        requestId,
        amount,
        resultCode,
        message,
        signature,
      } = req.body;

      // Kiểm tra chữ ký
      const rawSignature = `partnerCode=${partnerCode}&orderId=${orderId}&requestId=${requestId}&amount=${amount}&resultCode=${resultCode}&message=${message}`;
      const generatedSignature = crypto
        .createHmac("sha256", momoConfig.secretKey)
        .update(rawSignature)
        .digest("hex");

      if (generatedSignature !== signature) {
        return res.status(400).json({ error: "Invalid signature" });
      }

      // Xử lý trạng thái giao dịch
      if (resultCode === 0) {
        console.log(`Giao dịch thành công: ${orderId}`);
        // Cập nhật trạng thái đơn hàng trong DB
      } else {
        console.log(`Giao dịch thất bại: ${orderId}`);
        // Cập nhật trạng thái đơn hàng thất bại trong DB
      }

      res.status(200).json({ message: "IPN received successfully" });
    } catch (error) {
      console.error("Error handling IPN:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = PaymentController;
