import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import emailRoutes from './routes/emailRoutes.js';
import { handleInquiry } from './controllers/emailController.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api', emailRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Backend is running! Use /api/inquiry to send emails.');
});

// Test route - sends an AI-generated email automatically
app.get('/test-send-email', (req, res) => {
    console.log('--- Triggering Test AI Email ---');
    const mockReq = {
        body: {
            clinicName: 'Bexruz',
            email: 'bobidov062@gmail.com',
            inquiryData: { type: 'test_manual_trigger' }
        }
    };
    // Call existing logic
    handleInquiry(mockReq, res);
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Optional: Auto-trigger test email on startup (Uncomment below if desired)
    /*
    console.log('--- Triggering Startup Test AI Email ---');
    const startupReq = {
        body: {
            clinicName: 'Bexruz (Startup Test)',
            email: 'bobidov062@gmail.com',
            inquiryData: { type: 'startup_auto_test' }
        }
    };
    const mockRes = {
        status: () => ({ json: (data) => console.log('Startup test result:', data) })
    };
    handleInquiry(startupReq, mockRes);
    */
});
