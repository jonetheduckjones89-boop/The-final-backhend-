const { generateResponses } = require('../services/aiService');
const { sendInquiryEmails } = require('../services/emailService');

const handleInquiry = async (req, res, next) => {
    try {
        const data = req.body;

        // 1. Process and generate responses
        console.log('Processing inquiry...', data);
        const responses = await generateResponses(data);

        // 2. Email responses (mandatory)
        await sendInquiryEmails(responses);

        // 3. Log/Store (as requested: "Logged/stored by backend")
        // For now, logging to console is sufficient, but in a real app, this would be a DB entry.
        console.log('Inquiry processed successfully and emails sent.');

        res.status(200).json({
            success: true,
            message: 'Inquiry received and processed.'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { handleInquiry };
