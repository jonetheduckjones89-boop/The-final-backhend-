import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import emailRoutes from './routes/emailRoutes.js';
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
    res.send('Oren Backend is running. Data is stored in Supabase.');
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`\n\x1b[36m>>> OREN BACKEND STARTUP <<<\x1b[0m`);
    console.log(`Server listening on port: ${PORT}`);
    console.log(`Submissions tracked in: Supabase (Table: clinic_submissions)\n`);
});
