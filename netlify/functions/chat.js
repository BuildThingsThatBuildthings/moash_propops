const { OpenAI } = require('openai');

// Ashland MHC policies data
const policies = {
  community: {
    name: "Ashland MHC (Mobile Home Community)",
    address: "111 East Side Dr., Ashland, MO 65010"
  },
  management: {
    property_manager: "Anthony Thompson",
    tenant_contact_phone: "1-800-209-1533",
    tenant_contact_email: "TenantHelp@mhcpusa.com"
  },
  property_stats: {
    monthly_lot_rent: 290.00,
    occupied_lots: 48,
    total_lots: 104,
    occupancy_rate: "46.15%"
  },
  violation_fees: {
    rent: {
      late_fee_per_day: 15.00,
      administration_fee: 25.00
    },
    pets: {
      violation_fee: 100.00,
      administration_fee: 25.00
    },
    parking: {
      unauthorized_parking_fee: 25.00,
      administration_fee: 25.00
    },
    lawn_maintenance: {
      violation_fee: 35.00,
      administration_fee: 25.00
    }
  }
};

exports.handler = async (event, context) => {
  console.log('Chat function invoked');
  console.log('HTTP Method:', event.httpMethod);
  console.log('Environment check - OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);

  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    console.log('Invalid HTTP method:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not found in environment variables');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to Netlify environment variables.',
        help: 'Go to Site settings > Environment variables in Netlify dashboard',
        debug: 'This error occurs when the OPENAI_API_KEY environment variable is not set in Netlify.'
      })
    };
  }

  try {
    console.log('Parsing request body');
    const { request } = JSON.parse(event.body);

    if (!request || typeof request !== 'string') {
      console.log('Invalid request format');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing request parameter' })
      };
    }

    console.log('Request received:', request.substring(0, 50) + '...');

    // Initialize OpenAI
    console.log('Initializing OpenAI client');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const systemPrompt = `You are an information assistant for Ashland Mobile Home Community (MHC) community managers. Your job is to provide accurate, helpful information about community policies, procedures, and details.

COMMUNITY INFORMATION:
- Name: ${policies.community.name}
- Address: ${policies.community.address}  
- Manager: ${policies.management.property_manager}
- Tenant Contact: ${policies.management.tenant_contact_phone}
- Email: ${policies.management.tenant_contact_email}
- Monthly Rent: $${policies.property_stats.monthly_lot_rent}
- Occupancy: ${policies.property_stats.occupied_lots}/${policies.property_stats.total_lots} lots (${policies.property_stats.occupancy_rate})

FEES AND POLICIES:
- Late Rent: $${policies.violation_fees.rent.late_fee_per_day}/day after 5th + $${policies.violation_fees.rent.administration_fee} admin fee
- Pet Violations: $${policies.violation_fees.pets.violation_fee} + $${policies.violation_fees.pets.administration_fee} admin
- Parking Violations: $${policies.violation_fees.parking.unauthorized_parking_fee} + $${policies.violation_fees.parking.administration_fee} admin  
- Lawn Maintenance: $${policies.violation_fees.lawn_maintenance.violation_fee} + $${policies.violation_fees.lawn_maintenance.administration_fee} admin

Provide clear, concise, accurate answers about community policies, procedures, fees, and information. Always reference specific amounts and policies when applicable.`;

    console.log('Sending request to OpenAI');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: request }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    console.log('OpenAI response received');
    const response = completion.choices[0].message.content.trim();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        response_type: 'information',
        answer: response,
        metadata: {
          generated_at: new Date().toISOString(),
          ai_model: "gpt-4o-mini",
          tokens_used: completion.usage?.total_tokens || 0
        }
      })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    console.error('Error stack:', error.stack);
    
    // Check for specific OpenAI errors
    if (error.code === 'invalid_api_key') {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid OpenAI API key. Please check your API key in Netlify environment variables.',
          metadata: { generated_at: new Date().toISOString() }
        })
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        debug: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
        metadata: { generated_at: new Date().toISOString() }
      })
    };
  }
};