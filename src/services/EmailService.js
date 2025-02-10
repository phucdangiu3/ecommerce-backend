const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
var inlineBase64 = require("nodemailer-plugin-inline-base64");

const sendEmailCreateOrder = async (email, orderItems) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD, // App Password của Gmail
      },
    });
    transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));
    let listItem = "";
    orderItems.forEach((order) => {
      listItem += `<div>
          <div>
            Bạn đã đặt sản phẩm bên dưới với số lượng: <b>${order.amount}</b> và
            là giá: <b>${order.price} VND</b>
               <div>
             Bên dưới là hình ảnh của sản phẩm
          </div>
          </div>
               </div>`;
      attachImage.push({ path: order.image });
    });
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.MAIL_ACCOUNT}>`, // Địa chỉ email gửi
      to: "phanhoangphuc2906@gmail.com", // Danh sách người nhận
      subject: "Bạn đã đặt hàng tại shop Lập trình thật dễ", // Tiêu đề email
      text: "Hello world?", // Nội dung văn bản thuần
      html: `<div>Bạn đấ dặt hàng thành công tại shop Lập trình thật dễ</div> ${listItem}`, // Nội dung HTML
      attachments: attachImage,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = {
  sendEmailCreateOrder,
};
