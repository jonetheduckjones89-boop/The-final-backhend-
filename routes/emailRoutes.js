import express from 'express';
import { handleInquiry, resendEmail } from '../controllers/emailController.js';
const router = express.Router();

// Support both /inquiry (as requested) and /submit (as used by frontend)
router.post('/inquiry', handleInquiry);
router.post('/submit', handleInquiry);
router.post('/resend', resendEmail);

export default router;
