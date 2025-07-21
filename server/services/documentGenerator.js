const OpenAI = require('openai');
const policies = require('../data/ashland-policies.json');
const { violationNoticeSchema, lateRentNoticeSchema, maintenanceNoticeSchema } = require('../schemas/document-schemas');

class DocumentGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.policies = policies;
  }

  // Sanitize user input to prevent prompt injection
  sanitizeInput(input) {
    const dangerousPatterns = [
      /ignore.*previous.*instructions/gi,
      /system.*prompt/gi,
      /<\|im_start\|>/gi,
      /assistant.*:/gi,
      /human.*:/gi
    ];
    
    let sanitized = input;
    dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    return sanitized.trim();
  }

  // Handle both information requests and document generation
  async handleRequest(userRequest) {
    const sanitizedRequest = this.sanitizeInput(userRequest);
    
    // Check if this is a document generation request
    const isDocumentRequest = this.isDocumentGenerationRequest(sanitizedRequest);
    
    if (isDocumentRequest) {
      return await this.generateDocument(sanitizedRequest);
    } else {
      return await this.provideInformation(sanitizedRequest);
    }
  }

  // Check if request is asking for document generation
  isDocumentGenerationRequest(request) {
    const documentKeywords = [
      'create', 'generate', 'make', 'draft', 'write',
      'violation notice', 'late rent notice', 'document'
    ];
    
    const lowercaseRequest = request.toLowerCase();
    return documentKeywords.some(keyword => lowercaseRequest.includes(keyword));
  }

  // Provide information about Ashland MHC policies and procedures
  async provideInformation(userRequest) {
    const systemPrompt = `You are an information assistant for Ashland Mobile Home Community (MHC) community managers. Your job is to provide accurate, helpful information about community policies, procedures, and details.

COMMUNITY INFORMATION:
- Name: ${this.policies.community.name}
- Address: ${this.policies.community.address}  
- Manager: ${this.policies.management.property_manager}
- Tenant Contact: ${this.policies.management.tenant_contact_phone}
- Email: ${this.policies.management.tenant_contact_email}
- Monthly Rent: $${this.policies.property_stats.monthly_lot_rent}
- Occupancy: ${this.policies.property_stats.occupied_lots}/${this.policies.property_stats.total_lots} lots (${this.policies.property_stats.occupancy_rate})

FEES AND POLICIES:
- Late Rent: $${this.policies.violation_fees.rent.late_fee_per_day}/day after 5th + $${this.policies.violation_fees.rent.administration_fee} admin fee
- Pet Violations: $${this.policies.violation_fees.pets.violation_fee} + $${this.policies.violation_fees.pets.administration_fee} admin
- Parking Violations: $${this.policies.violation_fees.parking.unauthorized_parking_fee} + $${this.policies.violation_fees.parking.administration_fee} admin  
- Lawn Maintenance: $${this.policies.violation_fees.lawn_maintenance.violation_fee} + $${this.policies.violation_fees.lawn_maintenance.administration_fee} admin
- Pet Policy: Max ${this.policies.pet_policy.max_pets} pets, screening required via ${this.policies.pet_policy.screening_service}
- Pet Rent: $${this.policies.pet_policy.rent_by_fido_score['5_paw']}-$${this.policies.pet_policy.rent_by_fido_score['1_paw']}/month based on FIDO score

IMPORTANT POLICIES:
- ${Object.values(this.policies.important_rules).join('\n- ')}

Provide clear, concise, accurate answers about community policies, procedures, fees, and information. Always reference specific amounts and policies when applicable. If asked about document generation, explain that you can create official notices if requested.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userRequest }
        ],
        temperature: 0.1,
        max_tokens: 1000
      });

      const response = completion.choices[0].message.content.trim();
      
      return {
        success: true,
        response_type: 'information',
        answer: response,
        metadata: {
          generated_at: new Date().toISOString(),
          ai_model: "gpt-4o-mini",
          tokens_used: completion.usage?.total_tokens || 0
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        response_type: 'information',
        metadata: {
          generated_at: new Date().toISOString()
        }
      };
    }
  }

  // Generate document based on natural language request  
  async generateDocument(userRequest) {
    const sanitizedRequest = this.sanitizeInput(userRequest);
    
    const systemPrompt = `You are a document generation assistant for Ashland Mobile Home Community (MHC). Your job is to create structured JSON documents for community management.

COMMUNITY INFORMATION:
- Name: ${this.policies.community.name}
- Address: ${this.policies.community.address}  
- Manager: ${this.policies.management.property_manager}
- Tenant Contact: ${this.policies.management.tenant_contact_phone}
- Monthly Rent: $${this.policies.property_stats.monthly_lot_rent}

VIOLATION FEES:
- Late Rent: $${this.policies.violation_fees.rent.late_fee_per_day}/day + $${this.policies.violation_fees.rent.administration_fee} admin
- Pet Violations: $${this.policies.violation_fees.pets.violation_fee} + $${this.policies.violation_fees.pets.administration_fee} admin
- Parking: $${this.policies.violation_fees.parking.unauthorized_parking_fee} + $${this.policies.violation_fees.parking.administration_fee} admin  
- Lawn Maintenance: $${this.policies.violation_fees.lawn_maintenance.violation_fee} + $${this.policies.violation_fees.lawn_maintenance.administration_fee} admin
- General Rules: 1st offense $${this.policies.violation_fees.general_violations.first_offense}, 2nd offense $${this.policies.violation_fees.general_violations.second_offense}, 3rd offense eviction

You must respond ONLY with valid JSON in the following format based on the document type:

For VIOLATION NOTICES:
{
  "document_type": "violation_notice",
  "document_id": "VN-YYYYMMDD-LOT##",
  "tenant_info": {
    "lot_number": "extracted from request",
    "tenant_name": "if provided or [TENANT NAME]",
    "address": "111 Eastside Dr, Ashland, MO 65010"
  },
  "violation_details": {
    "violation_type": "pet_violation|parking_violation|lawn_maintenance|general_rules|conduct_violation|dumpster_violation",
    "description": "specific violation description",
    "violation_fee": fee_amount,
    "administration_fee": 25.00,
    "total_amount": violation_fee + admin_fee,
    "rule_reference": "specific rule section violated",
    "offense_number": 1
  },
  "dates": {
    "violation_date": "today or specified date",
    "issue_date": "today",  
    "payment_due_date": "30 days from today",
    "cure_period_end": "30 days from today"
  },
  "legal_text": "This notice is served upon you for violation of the lease agreement and community rules...",
  "consequences": ["specific consequences if not resolved"],
  "next_steps": ["specific actions tenant must take"]
}

For LATE RENT NOTICES:
{
  "document_type": "late_rent_notice",
  "document_id": "LRN-YYYYMMDD-LOT##",
  "tenant_info": {
    "lot_number": "extracted from request",
    "tenant_name": "if provided or [TENANT NAME]", 
    "address": "111 Eastside Dr, Ashland, MO 65010"
  },
  "rent_details": {
    "monthly_rent": 290.00,
    "days_late": calculated_days,
    "late_fees": days_late * 15.00,
    "administration_fee": 25.00,
    "total_amount_due": 290.00 + late_fees + 25.00,
    "original_due_date": "calculated date"
  },
  "payment_info": {
    "payment_methods": ["Money order", "Certified funds", "Online payment portal"],
    "late_fee_calculation": "$15.00 per day after the 5th of each month"
  },
  "legal_text": "Your rent payment is past due. Missouri law requires...",
  "consequences": ["Legal proceedings will begin after 10th", "Additional fees may apply"]
}

IMPORTANT: 
- Extract lot numbers, dates, and specific violations from the user request
- Calculate fees accurately based on the fee schedule
- Use today's date for issue_date
- Always include proper legal language
- Reference specific community rules when applicable`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: sanitizedRequest }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const response = completion.choices[0].message.content.trim();
      
      // Parse JSON response
      let documentData;
      try {
        // Extract JSON from response if it's wrapped in text
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : response;
        documentData = JSON.parse(jsonString);
      } catch (parseError) {
        throw new Error('Failed to parse AI response as JSON');
      }

      // Validate schema based on document type
      await this.validateDocument(documentData);

      return {
        success: true,
        document: documentData,
        metadata: {
          generated_at: new Date().toISOString(),
          ai_model: "gpt-4o-mini",
          tokens_used: completion.usage?.total_tokens || 0
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        metadata: {
          generated_at: new Date().toISOString()
        }
      };
    }
  }

  // Validate document against appropriate schema
  async validateDocument(documentData) {
    let schema;
    
    switch (documentData.document_type) {
      case 'violation_notice':
        schema = violationNoticeSchema;
        break;
      case 'late_rent_notice':
        schema = lateRentNoticeSchema;
        break;
      case 'maintenance_notice':
        schema = maintenanceNoticeSchema;
        break;
      default:
        throw new Error(`Unknown document type: ${documentData.document_type}`);
    }

    const { error } = schema.validate(documentData);
    if (error) {
      throw new Error(`Document validation failed: ${error.details[0].message}`);
    }

    return true;
  }

  // Get fee information for a specific violation type
  getFeeInfo(violationType) {
    const feeMap = {
      'pet_violation': this.policies.violation_fees.pets,
      'parking_violation': this.policies.violation_fees.parking,
      'lawn_maintenance': this.policies.violation_fees.lawn_maintenance,
      'general_rules': this.policies.violation_fees.general_violations,
      'conduct_violation': this.policies.violation_fees.conduct,
      'dumpster_violation': this.policies.violation_fees.dumpsters,
      'late_rent': this.policies.violation_fees.rent
    };

    return feeMap[violationType] || null;
  }

  // Calculate late rent fees
  calculateLateRent(daysLate) {
    const dailyFee = this.policies.violation_fees.rent.late_fee_per_day;
    const adminFee = this.policies.violation_fees.rent.administration_fee;
    const monthlyRent = this.policies.property_stats.monthly_lot_rent;

    return {
      monthly_rent: monthlyRent,
      days_late: daysLate,
      late_fees: daysLate * dailyFee,
      administration_fee: adminFee,
      total_amount_due: monthlyRent + (daysLate * dailyFee) + adminFee
    };
  }
}

module.exports = DocumentGenerator;