const { generateEnterpriseEmail } = require('../services/aiService');
const { sendWorkflowEmail } = require('../services/emailService');

const handleInquiry = async (req, res, next) => {
    try {
        // 1. Extraction & Validation (Mapping frontend fields to backend contract)
        const {
            clinicName,    // maps to clinic_name
            clinicType,    // used for analysis context
            email,         // client email
            website,       // client website
            message        // maps to notes
        } = req.body;

        // Reconciliation of field names for the AI service
        const clinic_name = clinicName;
        const contact_name = clinicName; // Defaulting to clinic name if individual name is absent
        const notes = `${clinicType ? `Type: ${clinicType}. ` : ''}${message || ''}`;

        if (!clinic_name || !email) {
            return res.status(400).json({ error: 'Missing required clinic information.' });
        }

        console.log(`Processing inquiry for: ${clinic_name}`);

        // 2. AI Analysis & Message Generation
        const emailBody = await generateEnterpriseEmail({
            clinic_name,
            contact_name,
            website,
            notes
        });

        // 3. Email Dispatch
        await sendWorkflowEmail(email, emailBody);

        // 4. Success Response
        res.status(200).json({
            success: true,
            message: 'Inquiry processed and workflow email dispatched.'
        });

    } catch (error) {
        console.error('Controller Error:', error.message);
        // Explicitly return 500 on service failures as requested
        res.status(500).json({
            success: false,
            error: error.message || 'An internal server error occurred.'
        });
    }
};

module.exports = { handleInquiry };
