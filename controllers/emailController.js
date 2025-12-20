import fs from 'fs';
import path from 'path';
import { sendPersonalEmail } from '../services/emailService.js';
import dotenv from 'dotenv';
dotenv.config();

const TRACK_FILE = process.env.EMAIL_TRACK_FILE || './emailStatus.json';

// Helper: Ensure JSON structure exists
function ensureStorage() {
    if (!fs.existsSync(TRACK_FILE)) {
        fs.writeFileSync(TRACK_FILE, JSON.stringify([], null, 2));
    }
}

// Handle new inquiry from frontend
export async function handleInquiry(req, res) {
    try {
        ensureStorage();

        // Match frontend field names
        const { clinicName, email, message } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        const submissions = JSON.parse(fs.readFileSync(TRACK_FILE));

        const newEntry = {
            clinicName: clinicName || 'Unknown Clinic',
            email,
            message: message || '',
            submittedAt: new Date(),
            emailSent: false
        };

        submissions.push(newEntry);
        fs.writeFileSync(TRACK_FILE, JSON.stringify(submissions, null, 2));

        // LOGGING: As requested
        console.log(`\x1b[32m[SUBMISSION]\x1b[0m New clinic submitted: ${newEntry.clinicName} (${email})`);

        res.status(200).json({ success: true, message: 'Inquiry saved successfully.' });
    } catch (err) {
        console.error('Submission Error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// Manually trigger sending emails to all unsent clinics
export async function manualSendEmails(req, res) {
    try {
        ensureStorage();
        const submissions = JSON.parse(fs.readFileSync(TRACK_FILE));
        let sentCount = 0;

        for (let entry of submissions) {
            if (!entry.emailSent) {
                try {
                    await sendPersonalEmail(entry);
                    entry.emailSent = true;
                    entry.sentAt = new Date();
                    sentCount++;
                } catch (emailErr) {
                    console.error(`Failed to send email to ${entry.email}:`, emailErr.message);
                }
            }
        }

        if (sentCount > 0) {
            fs.writeFileSync(TRACK_FILE, JSON.stringify(submissions, null, 2));
        }

        res.status(200).json({
            success: true,
            message: `Processed ${sentCount} new email(s).`
        });
    } catch (err) {
        console.error('Bulk Send Error:', err);
        res.status(500).json({ success: false, error: 'Failed to process bulk emails' });
    }
}
