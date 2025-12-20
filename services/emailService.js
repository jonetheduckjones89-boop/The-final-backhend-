const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'notifications@resend.dev';

/**
 * Sends the generated workflow email to the client.
 */
const sendWorkflowEmail = async (toEmail, messageBody) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `OREN AI <${FROM_EMAIL}>`,
            to: [toEmail],
            subject: 'Your OREN AI Workflow Is Being Prepared',
            text: messageBody, // Sending as plain text as requested
        });

        if (error) {
            console.error('Resend SDK Error:', error);
            throw new Error(`Email delivery failed: ${error.message}`);
        }

        console.log(`Email successfully dispatched to ${toEmail}: ${data.id}`);
        return data;
    } catch (error) {
        console.error('Email Service Error:', error);
        throw error;
    }
};

module.exports = { sendWorkflowEmail };
