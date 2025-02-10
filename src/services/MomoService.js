const crypto = require("crypto");
const https = require("https");

const momoConfig = {
  partnerCode: "MOMO",
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
  redirectUrl: "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b",
  ipnUrl: "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b",
};

class MoMoService {
  static createSignature(payload) {
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${payload.amount}&extraData=${payload.extraData}&ipnUrl=${payload.ipnUrl}&orderId=${payload.orderId}&orderInfo=${payload.orderInfo}&partnerCode=${payload.partnerCode}&redirectUrl=${payload.redirectUrl}&requestId=${payload.requestId}&requestType=${payload.requestType}`;
    console.log("Raw Signature:", rawSignature);

    return crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");
  }

  static async sendPaymentRequest(requestBody) {
    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      });

      req.on("error", (e) => {
        console.error("Error sending request to MoMo:", e);
        reject(e);
      });

      req.write(requestBody);
      req.end();
    });
  }
}

module.exports = {
  momoConfig,
  MoMoService,
};
