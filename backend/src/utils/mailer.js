const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

module.exports.sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
