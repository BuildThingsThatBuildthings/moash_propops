const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const DocumentGenerator = require('./services/documentGenerator');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com'] 
    : ['http://localhost:3000']
}));

// Rate limiting - 60 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: {
    error: 'Too many requests, please try again later.',
    resetTime: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));

// Initialize document generator
const documentGenerator = new DocumentGenerator();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'PropOps Manager Assistant'
  });
});

// Handle chat requests (information or document generation)
app.post('/api/chat', async (req, res) => {
  try {
    const { request } = req.body;

    if (!request || typeof request !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid request parameter',
        required: 'request (string)'
      });
    }

    if (request.length > 1000) {
      return res.status(400).json({
        error: 'Request too long',
        max_length: 1000
      });
    }

    // Handle request (information or document generation)
    const result = await documentGenerator.handleRequest(request);

    if (result.success) {
      if (result.response_type === 'information') {
        res.json({
          success: true,
          response_type: 'information',
          answer: result.answer,
          metadata: result.metadata
        });
      } else {
        res.json({
          success: true,
          response_type: 'document',
          document: result.document,
          metadata: result.metadata
        });
      }
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        response_type: result.response_type,
        metadata: result.metadata
      });
    }

  } catch (error) {
    console.error('Document generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get community policies endpoint
app.get('/api/policies', (req, res) => {
  try {
    const policies = require('./data/ashland-policies.json');
    res.json({
      success: true,
      policies: policies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load policies'
    });
  }
});

// Get fee calculator endpoint
app.post('/api/calculate-fees', (req, res) => {
  try {
    const { violation_type, days_late, offense_number } = req.body;

    if (violation_type === 'late_rent' && days_late) {
      const calculation = documentGenerator.calculateLateRent(days_late);
      return res.json({
        success: true,
        calculation: calculation
      });
    }

    const feeInfo = documentGenerator.getFeeInfo(violation_type);
    if (!feeInfo) {
      return res.status(400).json({
        success: false,
        error: 'Invalid violation type'
      });
    }

    res.json({
      success: true,
      fee_info: feeInfo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate fees'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    available_endpoints: [
      'GET /api/health',
      'POST /api/chat',
      'GET /api/policies',
      'POST /api/calculate-fees'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`PropOps Manager Assistant Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
});