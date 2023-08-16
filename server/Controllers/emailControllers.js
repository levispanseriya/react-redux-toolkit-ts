const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "levispanseriya@gmail.com",
    pass: "shrageuwydgbukry",
  },
});

const sendMail = async (to, subject, text, html) => {
  const mailOptions = {
    from: "levispanseriya@gmail.com",
    to,
    subject,
    text,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`${subject}, Email sent successfully!`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendResetPasswordEmail = async (email, resetToken) => {
  const resetLink = `${process.env.BASEURL}/reset-password?token=${resetToken}`;

  const textContent = `Click on the following link to reset your password: ${resetLink}`;
  const htmlContent = `<p>Click on the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`;

  try {
    await transporter.sendMail(
      email,
      "Reset Password",
      textContent,
      htmlContent
    );
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
};

module.exports = {
  sendResetPasswordEmail,
  transporter,
  sendMail,
};
