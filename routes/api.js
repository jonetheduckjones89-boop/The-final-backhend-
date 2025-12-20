const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');

// Using /submit to match production hotfix requirements
router.post('/submit', inquiryController.handleInquiry);

module.exports = router;
