const Resend = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendCustomEmail({ to, clinicName }) {
  try {
    console.log("Sending email to:", to);

    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to,
      subject: `Thank you ${clinicName}`,
      html: `<p>Hi ${clinicName},</p>
             <p>Thank you for your request. Our team will analyze your data and create a custom workflow for your clinic. Stay tuned!</p>
             <p>— The OREN Team</p>`,
    });

    console.log("Email sent successfully:", response);
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
}

module.exports = { sendCustomEmail };

