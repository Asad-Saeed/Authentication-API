import dotenv from "dotenv";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
dotenv.config();

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Set to true for secure connections (465), false for others (587)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    authMethod: "PLAIN", // Explicitly set the authMethod
  })
);

export default transporter;
