const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const classifyIntent = async (context) => {
  const prompt = `Based on this inquiry: ${context}, classify the user's primary intent (e.g., Clinical Automation Request, Career Application, Strategic Partnership, General Inquiry). Return ONLY the classification string.`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

const generateResponses = async (data) => {
  const { clinicName, website, clinicType, email, message, name, about } = data;

  const context = `
    User submitted an inquiry for Oren (Healthcare Automation Platform).
    Details:
    ${clinicName ? `Clinic Name: ${clinicName}` : ''}
    ${website ? `Website: ${website}` : ''}
    ${clinicType ? `Clinic Type: ${clinicType}` : ''}
    ${email ? `Email: ${email}` : ''}
    ${message ? `Pain Point: ${message}` : ''}
    ${name ? `Applicant Name: ${name}` : ''}
    ${about ? `About Applicant: ${about}` : ''}
  `;

  // 1. Classify Intent (as requested)
  const intent = await classifyIntent(context);
  console.log('Classified Intent:', intent);

  const prompts = {
    clinic: `
      Inquiry Context: ${context}
      Classified Intent: ${intent}
      Generate a CLINIC RESPONSE.
      Target: Healthcare professionals/clinic owners.
      Tone: Professional, healthcare-safe, outcome-focused, non-technical.
      Focus: Better treatment, data continuity, efficiency, patient experience.
      Format: Professional email body.
    `,
    investor: `
      Inquiry Context: ${context}
      Classified Intent: ${intent}
      Generate an INVESTOR RESPONSE.
      Target: Venture Capitalists / Strategic Partners.
      Tone: Strategic, scalable, metrics-driven, VC-grade.
      Focus: Infrastructure, ROI framing, market opportunity, scalability.
      Format: Professional brief/email body.
    `,
    team: `
      Inquiry Context: ${context}
      Classified Intent: ${intent}
      Generate a TEAM RESPONSE.
      Target: Internal Engineering and Product teams.
      Tone: Technical, operational, execution-focused.
      Focus: Clear internal next steps, technical requirements, implementation details.
      Format: Internal memo body.
    `
  };

  const results = { intent };

  // 2. Generate Audience-Specific Responses
  for (const [key, prompt] of Object.entries(prompts)) {
    const response = await model.generateContent(prompt);
    results[key] = response.response.text();
  }

  return results;
};

module.exports = { generateResponses };
