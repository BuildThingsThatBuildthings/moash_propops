# Test Requests for PropOps Manager Assistant

This document contains example requests you can use to test the document generation functionality.

## Pet Violation Examples

**Basic Pet Violation:**
```
Create a pet violation notice for lot 25, tenant has unapproved pet
```

**Pet Not Inside:**
```
Pet violation for lot 12 - dog was left tied up outside, first offense
```

**Pet Waste Violation:**
```
Create a notice for lot 8, tenant didn't clean up pet waste in common area
```

## Late Rent Examples

**Simple Late Rent:**
```
Late rent notice for lot 15, rent is 3 days overdue
```

**Extended Late Period:**
```
Generate late rent notice for lot 22, tenant is 8 days late on rent payment
```

**Near Legal Proceedings:**
```
Late rent notice for lot 5, rent is 9 days late and approaching legal action
```

## Parking Violations

**Unauthorized Parking:**
```
Parking violation for lot 33, tenant parked on another lot without permission
```

**Guest Parking Abuse:**
```
Create violation notice for lot 18, tenant using guest parking for personal vehicle
```

**Vehicle Repair Violation:**
```
Parking violation for lot 27, tenant was changing oil in driveway
```

## Lawn Maintenance

**Long Grass:**
```
Lawn maintenance violation for lot 11, grass is over 4 inches tall
```

**Unmaintained Yard:**
```
Create lawn violation for lot 19, yard has weeds and dead branches
```

**Heat Tape Inspection:**
```
Maintenance notice for lot 7, heat tape inspection shows non-working tape
```

## General Rule Violations

**Noise Complaint:**
```
General rule violation for lot 14, loud music late at night disturbing neighbors
```

**Unauthorized Guests:**
```
Violation notice for lot 21, unapproved guest staying over 2 weeks
```

**Home Maintenance:**
```
Rule violation for lot 9, skirting needs repair and home needs power washing
```

## Complex Scenarios

**Multiple Violations:**
```
Create violation notice for lot 16: pet violation (dog outside unattended) and parking violation (blocking driveway)
```

**Repeat Offender:**
```
Second offense pet violation for lot 4, dog was outside again after first warning
```

**Emergency Escalation:**
```
Conduct violation for lot 31, tenant was aggressive and threatening, police contacted
```

## Expected JSON Structure

Each request should generate a structured JSON document containing:

- `document_type`: Type of notice being generated
- `document_id`: Unique identifier (format: TYPE-YYYYMMDD-LOT##)  
- `tenant_info`: Lot number, tenant name (or placeholder), address
- `violation_details`: Specific violation, fees, rule references
- `dates`: Issue date, due dates, cure periods
- `legal_text`: Appropriate legal language for the violation
- `consequences`: What happens if not resolved
- `next_steps`: Actions tenant must take

## Fee Calculations

The system should automatically calculate:

- **Pet Violations**: $100 + $25 admin fee = $125 total
- **Parking**: $25 + $25 admin fee = $50 total  
- **Lawn Maintenance**: $35 + $25 admin fee = $60 total
- **Late Rent (3 days)**: $290 rent + $45 late fees + $25 admin = $360 total
- **Late Rent (8 days)**: $290 rent + $120 late fees + $25 admin = $435 total

## Testing Notes

When testing, verify:

1. **Accurate Fee Calculations** - Fees match Ashland MHC policy
2. **Proper Legal Language** - Appropriate tone and references
3. **Complete Information** - All required fields populated
4. **Consistent Formatting** - JSON structure matches schema
5. **Mobile Responsiveness** - Interface works on mobile devices
6. **Error Handling** - Graceful handling of invalid requests