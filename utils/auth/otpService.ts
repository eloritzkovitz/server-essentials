import crypto from "crypto";
import nodemailer from "nodemailer";
import config from "../../config/config";

/**
 * Generate a random OTP and its expiration time.
 * @returns {object} An object containing the OTP and its expiration time.
 */
export function generateOtp() {
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  return { otp, otpExpires };
}

/**
 * Send an OTP email using SMTP credentials from environment variables.
 * @param to Recipient email address
 * @param otp The OTP code to send
 * @param subject Email subject
 */
export async function sendOtpMail(to: string, otp: string, subject: string) {
  const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: true, 
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

  await transporter.sendMail({
    from: config.smtp.from,
    to,
    subject,
    text: `Your OTP code is: ${otp}`,
    html: `<p>Your OTP code is: <b>${otp}</b></p>`,
  });
}
