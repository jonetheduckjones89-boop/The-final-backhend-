import express from 'express';
import { handleInquiry, manualSendEmails } from '../controllers/emailController.js';

const router = express.Router();

// Logic for submissions (supports both /inquiry and /submit)
router.post('/inquiry', handleInquiry);
router.post('/submit', handleInquiry);

// Logic for manually triggering email delivery via Gmail
router.post('/sendEmails', manualSendEmails);

export default router;
