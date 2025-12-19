const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');

router.post('/inquiry', inquiryController.handleInquiry);

module.exports = router;
