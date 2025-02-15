import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_GMAIL, // Your Gmail address
    pass:process.env.AUTH_PASS,   // Your Gmail password or app-specific password
  },
});

// Function to send OTP email
async function sendOTPEmail(toEmail, otp) {
  const mailOptions = {
    from: 'shivanitawade20@gmail.com',
    to: toEmail,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error)
    } else {
      console.log('Email sent:', info.response);
    }
  });

}

// Example Usage
export default sendOTPEmail;
