import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resendClient = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to, subject, html) {
    try {
        const email = await resendClient.emails.send({
            from: 'bobidov062@gmail.com', // Note: This requires domain verification in Resend or will use onboarding@resend.dev fallback
            to,
            subject,
            html,
        });
        console.log('Email sent:', email.data?.id);
        return email;
    } catch (err) {
        console.error('Error sending email:', err);
        throw err;
    }
}
