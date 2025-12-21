const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

app.post('/api/submit', async (req, res) => {
    try {
        const { clinicName, email, phone, message, website, clinicType } = req.body;

        if (!clinicName || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await transporter.sendMail({
            from: `"Clinic Lead" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            subject: `🦷 New Clinic Submission — ${clinicName}`,
            text: `
New Clinic Submission

Clinic Name: ${clinicName}
Email: ${email}
Phone: ${phone || 'N/A'}
Website: ${website || 'N/A'}
Type: ${clinicType || 'N/A'}
Message: ${message || 'N/A'}

Received at: ${new Date().toISOString()}
      `,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Email send failed:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});
