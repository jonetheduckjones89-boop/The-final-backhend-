const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Analyzes clinic data and generates a professional, enterprise-tone email body.
 */
const generateEnterpriseEmail = async (data) => {
  const { clinic_name, contact_name, website, notes } = data;

  const prompt = `
    You are a senior clinical systems analyst at OREN, a premium healthcare automation platform.
    Analyze the following inquiry:
    Clinic: ${clinic_name}
    Contact: ${contact_name}
    Website: ${website}
    Notes: ${notes || 'None provided'}

    Task:
    1. Infer the operational needs of a clinic in this segment.
    2. Generate a professional, enterprise-level email response to ${contact_name}.
    
    Email Requirements:
    - Subject Line (DO NOT INCLUDE IN OUTPUT): Your OREN AI Workflow Is Being Prepared
    - Address the client by name (${contact_name}).
    - Mention the clinic name (${clinic_name}) naturally.
    - Acknowledge that we have received their operational data.
    - State that the OREN engineering team is currently analyzing their existing systems.
    - Mention the creation of a custom AI-powered workflow designed specifically for their environment.
    - Tone: Calm, professional, and premium. Avoid hype, emojis, and marketing fluff.
    - Output ONLY the email body as plain text. Do not use markdown (no bolding, no headers).
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    throw new Error('Failed to analyze clinic data and generate response.');
  }
};

module.exports = { generateEnterpriseEmail };
