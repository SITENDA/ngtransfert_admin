import nodemailer, { Transporter } from 'nodemailer';
import { randomInt } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Define the type for the transporter
let transporter: Transporter;

// Configure Nodemailer transporter (replace with your email provider details)
// It's best to initialize the transporter *once*, often outside of any function
try {
  transporter = nodemailer.createTransport({
    service: 'YourEmailService', // e.g., 'gmail', 'yahoo', or your SMTP details
    auth: {
      user: 'your_email@example.com',
      pass: 'your_email_password',
    },
  });
} catch (error) {
  console.error("Error creating transporter:", error);
  // Handle the error appropriately, e.g., throw it or set transporter to null.
  throw error; // Or transporter = null; and handle null checks later
}


interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}


export async function sendEmail(options: EmailOptions): Promise<void> {
    try {
        if (!transporter) {
          throw new Error("Transporter not initialized. Check your email configuration.");
        }
        await transporter.sendMail({
            from: 'your_email@example.com',
            to: options.to,
            subject: options.subject,
            html: options.html, // Use HTML for formatted emails
        });
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error for proper handling up the call stack
    }
}

export function generateOTP(length: number): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[randomInt(0, 10)];
    }
    return otp;
}

// Example usage (for OTP):
const otp = generateOTP(6);
const html = `<p>Your OTP is: <strong>${otp}</strong></p>`; // HTML email body
sendEmail({ to: 'recipient@example.com', subject: 'Your OTP', html });

// Example usage (for Smart Link):
const token = uuidv4();
const smartLink = `https://yourdomain.com/verify?token=${token}`;
const htmlLink = `<p>Click this link to verify your email: <a href="${smartLink}">Verify</a></p>`;
sendEmail({ to: 'recipient@example.com', subject: 'Verify Your Email', html: htmlLink });