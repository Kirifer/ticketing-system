require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP server is ready");
  }
});
module.exports = transporter;