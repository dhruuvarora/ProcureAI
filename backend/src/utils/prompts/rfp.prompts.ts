export const RFP_CREATION_PROMPT = (input: string) => `
You are an expert procurement assistant.

Convert the following procurement requirement into STRICT JSON.
Do not add explanations.
Do not wrap in markdown.
Return only valid JSON.

Schema:
{
  "items": [
    {
      "item_type": string,
      "quantity": number,
      "specifications": object
    }
  ],
  "budget": number | null,
  "delivery_days": number | null,
  "payment_terms": string | null,
  "warranty": string | null,
  "assumptions": string[]
}

Rules:
- If something is not mentioned, use null.
- Extract numbers as numbers.
- delivery_days must be number of days.
- assumptions should capture implied requirements.

Input:
${input}
`;
