import { sendPersonalEmail } from '../services/emailService.js';
import { supabase } from '../config/supabaseClient.js';

// Handle new inquiry from frontend
export async function handleInquiry(req, res) {
    try {
        // Match frontend field names
        const { clinicName, email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        // Insert into Supabase
        const { error } = await supabase
            .from('clinic_submissions')
            .insert([
                {
                    clinic_name: clinicName || 'Unknown Clinic',
                    email: email
                }
            ]);

        if (error) {
            console.error('Supabase Insert Error:', error);
            throw error;
        }

        // LOGGING: As requested
        console.log(`\x1b[32m[SUBMISSION]\x1b[0m New clinic submitted: ${clinicName || 'Unknown Clinic'} (${email})`);

        res.status(200).json({ success: true, message: 'Inquiry saved successfully.' });
    } catch (err) {
        console.error('Submission Error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// Manually trigger sending emails to all unsent clinics
export async function manualSendEmails(req, res) {
    try {
        // Fetch all pending submissions
        const { data: submissions, error } = await supabase
            .from('clinic_submissions')
            .select('*')
            .eq('email_sent', false);

        if (error) {
            console.error('Supabase Fetch Error:', error);
            throw error;
        }

        let sentCount = 0;

        if (submissions && submissions.length > 0) {
            for (let row of submissions) {
                try {
                    // Map DB columns to email service expectation
                    const emailData = {
                        clinicName: row.clinic_name,
                        email: row.email,
                        // message field is not in the schema provided, so we omit or pass undefined
                    };

                    await sendPersonalEmail(emailData);

                    // Update Supabase
                    const { error: updateError } = await supabase
                        .from('clinic_submissions')
                        .update({ email_sent: true })
                        .eq('id', row.id);

                    if (updateError) {
                        console.error(`Failed to update status for ${row.email}:`, updateError);
                    } else {
                        sentCount++;
                    }
                } catch (emailErr) {
                    console.error(`Failed to send email to ${row.email}:`, emailErr.message);
                }
            }
        }

        // Return safe message if none pending, or count
        res.status(200).json({
            success: true,
            message: sentCount > 0
                ? `Processed ${sentCount} new email(s).`
                : 'No pending emails to send.'
        });
    } catch (err) {
        console.error('Bulk Send Error:', err);
        res.status(500).json({ success: false, error: 'Failed to process bulk emails' });
    }
}
