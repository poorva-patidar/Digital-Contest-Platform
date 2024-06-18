const nodemailer = require("nodemailer");
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASSWORD,
} = require("../config/environment");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: "Digital Contest PLatform <invite@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
