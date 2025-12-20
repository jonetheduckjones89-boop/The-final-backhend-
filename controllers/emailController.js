import { sendEmail } from '../services/emailService.js';
import dotenv from 'dotenv';
import fs from 'fs';
import axios from 'axios';
dotenv.config();

const TRACK_FILE = './emailStatus.json';
if (!fs.existsSync(TRACK_FILE)) fs.writeFileSync(TRACK_FILE, JSON.stringify({}));

// Helper: Generate email content with Gemini API
async function generateEmailContent(clientName, inquiryData) {
    try {
        // Note: Using the URL and model exactly as requested by the user
        const response = await axios.post('https://api.gemini.com/v1/completions', {
            model: 'gemini-1-mini',
            prompt: `Write a professional, personalized email for ${clientName} using this data: ${JSON.stringify(inquiryData)}`,
            max_tokens: 500
        }, {
            headers: { 'Authorization': `Bearer ${process.env.GEMINI_API_KEY}` }
        });

        return response.data.choices[0].text;
    } catch (err) {
        console.error('Error generating email content:', err);
        // Fallback as requested
        return `Hello ${clientName}, here is a custom workflow based on your inquiry.`;
    }
}

// Handle new inquiry
export async function handleInquiry(req, res) {
    try {
        // Mapping frontend fields (clinicName, email, etc.) to the requested logic
        const { clinicName, email, ...inquiryData } = req.body;
        const clientName = clinicName || 'Client';
        const clientEmail = email;

        if (!clientEmail) {
            return res.status(400).json({ success: false, error: 'Client email is required' });
        }

        const emailBody = await generateEmailContent(clientName, inquiryData);

        await sendEmail(clientEmail, `Your Custom Workflow, ${clientName}`, `<div>${emailBody.replace(/\n/g, '<br>')}</div>`);

        const statusData = JSON.parse(fs.readFileSync(TRACK_FILE));
        statusData[clientEmail] = { sentAt: new Date(), opened: false, lastAttempt: new Date() };
        fs.writeFileSync(TRACK_FILE, JSON.stringify(statusData, null, 2));

        res.status(200).json({ success: true, message: 'Email sent and tracked.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
}

// Resend logic
export async function resendEmail(req, res) {
    try {
        const { clientEmail } = req.body;
        const statusData = JSON.parse(fs.readFileSync(TRACK_FILE));
        if (!statusData[clientEmail]) return res.status(404).json({ success: false, error: 'No email record found' });

        const emailRecord = statusData[clientEmail];
        const sentAt = new Date(emailRecord.sentAt);
        const hoursSinceSent = (new Date().getTime() - sentAt.getTime()) / 36e5;

        if (!emailRecord.opened && hoursSinceSent > 24) {
            const emailBody = `Hello again, following up on your custom workflow.`;
            await sendEmail(clientEmail, `Follow-up: Your Custom Workflow`, `<div>${emailBody}</div>`);

            emailRecord.lastAttempt = new Date();
            fs.writeFileSync(TRACK_FILE, JSON.stringify(statusData, null, 2));
            return res.status(200).json({ success: true, message: 'Resend email sent.' });
        } else {
            return res.status(400).json({ success: false, message: 'Email already opened or resend too soon.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
