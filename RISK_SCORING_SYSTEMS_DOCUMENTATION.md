# Risk Scoring Systems Documentation
## CyberLockX Platform - Clear Distinctions

---

## 1. PREVENTIVE QUALITATIVE DEVICE RISK SCORE
**Location:** Section #12 Device Inventory Tracking  
**Field:** Device Risk Score (Optional) - 0-100 scale  
**Purpose:** Pre-incident vulnerability assessment

### What It Is:
- **Preventive assessment** conducted BEFORE any security incident occurs
- **Qualitative risk scoring** to gauge device vulnerability potential
- **Planning tool** to prioritize security investments and device hardening
- **Risk prediction** based on organizational threat landscape

### How It Works:
1. Takes security risks feared by organization (from Section #3)
2. Applies likelihood vs impact matrix analysis
3. Considers device type, configuration, and environment
4. Generates 0-100 risk score for each device
5. Helps identify which devices need immediate security attention

### Data Sources:
- SIEM/EDR systems (if available)
- Manual qualitative assessment using Section #3 security risks
- Device configuration analysis
- Environmental risk factors

### Risk Matrix Formula:
```
Device Risk Score = Σ(Likelihood × Impact) for each feared security risk
- Likelihood: Rare(1) → Unlikely(2) → Likely(3) → Very Likely(4) → Most Certain(5)
- Impact: Trivial(1) → Minor(2) → Moderate(3) → Major(4) → Extreme(5)
- Final Score: Converted to 0-100 scale
```

### Use Cases:
- Device security prioritization
- Vulnerability management planning
- Security budget allocation
- Compliance preparation
- Risk communication to management

---

## 2. RASBITA COST-BENEFIT ANALYSIS RISK SCORE
**Location:** RASBITA Reports and Incident Response  
**Field:** Various financial and impact metrics  
**Purpose:** Post-incident or real-time incident analysis

### What It Is:
- **Reactive analysis** conducted DURING or AFTER a security incident
- **Cost-benefit quantitative analysis** of actual security impacts
- **Financial risk assessment** with real dollar amounts and losses
- **Incident response tool** for damage assessment and recovery planning

### How It Works:
1. Analyzes actual incident damage and costs
2. Calculates Asset Value (AV), Exposure Factor (EF), Single Loss Expectancy (SLE)
3. Determines Annualized Loss Expectancy (ALE) and Annualized Rate of Occurrence (ARO)
4. Provides cost-benefit analysis for security controls
5. Generates comprehensive financial impact reports

### Data Sources:
- Actual incident costs and damages
- Asset replacement costs
- Business interruption losses
- Regulatory fines and penalties
- Recovery and remediation expenses

### RASBITA Formula:
```
SLE = Asset Value × Exposure Factor
ALE = SLE × Annualized Rate of Occurrence
Cost-Benefit = ALE - Annual Cost of Safeguards
```

### Use Cases:
- Post-incident damage assessment
- Insurance claims and reporting
- Board-level risk communication
- Security investment justification
- Regulatory compliance reporting

---

## KEY DISTINCTIONS

| Aspect | Preventive Device Risk Score | RASBITA Risk Score |
|--------|------------------------------|-------------------|
| **Timing** | BEFORE incidents (preventive) | DURING/AFTER incidents (reactive) |
| **Purpose** | Vulnerability prediction | Damage assessment |
| **Data Type** | Qualitative assessment | Quantitative financial |
| **Scale** | 0-100 risk score | Dollar amounts and percentages |
| **Frequency** | Continuous monitoring | Per-incident analysis |
| **Audience** | IT/Security teams | Executive/Board level |
| **Action** | Prevent incidents | Respond to incidents |

---

## IMPLEMENTATION GUIDELINES

### For Preventive Device Risk Scoring:
- Use Section #3 security risks as input
- Apply likelihood vs impact matrix
- Generate 0-100 scores for device prioritization
- Update scores based on configuration changes
- Integrate with vulnerability management workflows

### For RASBITA Analysis:
- Trigger only during actual security incidents
- Collect real financial impact data
- Calculate actual costs and losses
- Generate cost-benefit analysis reports
- Support incident response and recovery decisions

---

## IMPORTANT NOTES

⚠️ **Never confuse these two systems:**
- Preventive Device Risk Score ≠ RASBITA Risk Score
- Qualitative assessment ≠ Cost-benefit analysis
- Pre-incident planning ≠ Post-incident response
- Vulnerability prediction ≠ Damage assessment

✅ **Both systems are valuable but serve different purposes:**
- Use Preventive Risk Scoring for security planning
- Use RASBITA for incident response and financial analysis
- Both inform overall cybersecurity strategy but at different stages

---

*This documentation ensures clear understanding and prevents confusion between the two distinct risk scoring methodologies used in the CyberLockX platform.*