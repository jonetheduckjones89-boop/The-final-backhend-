import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MY_PERSONAL_EMAIL,
        pass: process.env.MY_PERSONAL_EMAIL_PASSWORD, // Use App Password for Gmail
    },
});

/**
 * Sends a personal email to a clinic.
 */
export async function sendPersonalEmail(clinicData) {
    const { clinicName, email, message } = clinicData;

    const mailOptions = {
        from: process.env.MY_PERSONAL_EMAIL,
        to: email,
        subject: `Welcome to the Oren Platform - ${clinicName}`,
        html: `
      <h2>Hello ${clinicName},</h2>
      <p>Thank you for reaching out to Oren. We have received your inquiry:</p>
      <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #666;">
        ${message || 'No additional message provided.'}
      </blockquote>
      <p>Our team will review your data and get back to you shortly.</p>
      <br/>
      <p>Best regards,</p>
      <p><strong>The Oren Team</strong></p>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}: ${info.messageId}`);
        return info;
    } catch (err) {
        console.error(`Error sending email to ${email}:`, err);
        throw err;
    }
}
