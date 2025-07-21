const Joi = require('joi');

// Base document schema
const baseDocumentSchema = {
  document_id: Joi.string().required(),
  document_type: Joi.string().valid(
    'violation_notice',
    'late_rent_notice', 
    'lease_violation',
    'maintenance_notice',
    'move_out_notice',
    'emergency_notice'
  ).required(),
  created_date: Joi.date().default(Date.now),
  tenant_info: Joi.object({
    lot_number: Joi.string().required(),
    tenant_name: Joi.string().required(),
    address: Joi.string().default('111 Eastside Dr, Ashland, MO 65010')
  }).required(),
  community_info: Joi.object({
    community_name: Joi.string().default('Ashland MHC'),
    manager_name: Joi.string().default('Anthony Thompson'),
    contact_phone: Joi.string().default('1-800-209-1533'),
    contact_email: Joi.string().default('TenantHelp@mhcpusa.com'),
    mailing_address: Joi.string().default('1050 Glenbrook Way Ste 480-220, Hendersonville, TN 37075')
  }).required()
};

// Violation Notice Schema
const violationNoticeSchema = Joi.object({
  ...baseDocumentSchema,
  violation_details: Joi.object({
    violation_type: Joi.string().valid(
      'pet_violation',
      'parking_violation', 
      'lawn_maintenance',
      'general_rules',
      'conduct_violation',
      'dumpster_violation'
    ).required(),
    description: Joi.string().required(),
    violation_fee: Joi.number().required(),
    administration_fee: Joi.number().default(25.00),
    total_amount: Joi.number().required(),
    rule_reference: Joi.string().required(),
    offense_number: Joi.number().valid(1, 2, 3).default(1)
  }).required(),
  dates: Joi.object({
    violation_date: Joi.date().required(),
    issue_date: Joi.date().default(Date.now),
    payment_due_date: Joi.date().required(),
    cure_period_end: Joi.date().required()
  }).required(),
  legal_text: Joi.string().required(),
  consequences: Joi.array().items(Joi.string()).required(),
  next_steps: Joi.array().items(Joi.string()).required()
});

// Late Rent Notice Schema
const lateRentNoticeSchema = Joi.object({
  ...baseDocumentSchema,
  rent_details: Joi.object({
    monthly_rent: Joi.number().default(290.00),
    days_late: Joi.number().required(),
    late_fees: Joi.number().required(),
    administration_fee: Joi.number().default(25.00),
    total_amount_due: Joi.number().required(),
    original_due_date: Joi.date().required()
  }).required(),
  payment_info: Joi.object({
    payment_methods: Joi.array().items(Joi.string()).default([
      'Money order',
      'Certified funds',
      'Online payment portal'
    ]),
    late_fee_calculation: Joi.string().required()
  }).required(),
  legal_text: Joi.string().required(),
  consequences: Joi.array().items(Joi.string()).required()
});

// Maintenance Notice Schema  
const maintenanceNoticeSchema = Joi.object({
  ...baseDocumentSchema,
  maintenance_details: Joi.object({
    issue_type: Joi.string().valid(
      'heat_tape_inspection',
      'home_maintenance',
      'skirting_repair',
      'lawn_care',
      'deck_requirements'
    ).required(),
    description: Joi.string().required(),
    urgency: Joi.string().valid('immediate', 'within_30_days', 'seasonal').required(),
    estimated_cost: Joi.number().optional()
  }).required(),
  compliance_deadline: Joi.date().required(),
  consequences: Joi.array().items(Joi.string()).required(),
  vendor_info: Joi.object({
    recommended_vendors: Joi.array().items(Joi.string()).optional(),
    tenant_responsibility: Joi.boolean().default(true)
  }).optional()
});

module.exports = {
  violationNoticeSchema,
  lateRentNoticeSchema,
  maintenanceNoticeSchema
};