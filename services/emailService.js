const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const RECIPIENT_EMAIL = 'bobidov062@gmail.com';

const sendInquiryEmails = async (responses) => {
    const { clinic, investor, team } = responses;

    const emails = [
        {
            from: 'Oren <notifications@resend.dev>',
            to: RECIPIENT_EMAIL,
            subject: '[CLINIC RESPONSE]',
            html: `<div>${clinic.replace(/\n/g, '<br>')}</div>`
        },
        {
            from: 'Oren <notifications@resend.dev>',
            to: RECIPIENT_EMAIL,
            subject: '[INVESTOR RESPONSE]',
            html: `<div>${investor.replace(/\n/g, '<br>')}</div>`
        },
        {
            from: 'Oren <notifications@resend.dev>',
            to: RECIPIENT_EMAIL,
            subject: '[TEAM RESPONSE]',
            html: `<div>${team.replace(/\n/g, '<br>')}</div>`
        }
    ];

    for (const email of emails) {
        const { data, error } = await resend.emails.send(email);
        if (error) {
            console.error('Email delivery failed:', error);
            throw new Error(`Failed to send email: ${email.subject}`);
        }
        console.log(`Email sent successfully: ${email.subject}`, data.id);
    }
};

module.exports = { sendInquiryEmails };
