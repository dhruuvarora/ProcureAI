export const PROPOSAL_COMPARISON_PROMPT = (
  rfp: any,
  proposals: any[]
) => `
You are assisting a procurement manager.

RFP requirements:
${JSON.stringify(rfp, null, 2)}

Vendor proposals:
${JSON.stringify(proposals, null, 2)}

Task:
1. Compare vendors on pricing, delivery, and completeness.
2. Recommend ONE vendor.
3. Clearly explain WHY.

Return STRICT JSON only:
{
  "summary": string,
  "recommended_vendor": {
    "vendor_id": number,
    "vendor_name": string,
    "reason": string
  },
  "comparison": [
    {
      "vendor_name": string,
      "total_cost": number | null,
      "delivery_days": number | null,
      "notes": string
    }
  ]
}
`;
