const { sendCustomEmail } = require('../services/emailService');

async function handleInquiry(req, res, next) {
  try {
    const { clinicName, email, website, clinicType, message } = req.body;

    // TODO: AI analysis logic (optional, uses GEMINI_API_KEY)
    // const analysisResult = await analyzeClinicData({ clinicName, website, clinicType, message });

    // Send custom email
    await sendCustomEmail({ to: email, clinicName });

    res.status(200).json({ success: true, message: "Inquiry received and email sent." });
  } catch (error) {
    next(error);
  }
}

module.exports = { handleInquiry };

