import { simpleParser } from "mailparser";

export async function parseRawEmail(rawEmail: Buffer) {
  const parsed = await simpleParser(rawEmail);

  const from = parsed.from?.value[0]?.address || null;

  return {
    from,
    subject: parsed.subject || "",
    body: parsed.text || "",
    attachments: parsed.attachments || [],
  };
}

export function extractRfpId(body: string): number | null {
  const match = body.match(/RFP\s*ID[: ]+(\d+)/i);
  return match ? Number(match[1]) : null;
}

export function parseProposalFields(body: string) {
  const costMatch = body.match(/total\s*cost[: ]+([\d,]+)/i);

  return {
    total_cost: costMatch ? Number(costMatch[1].replace(/,/g, "")) : null
  };
}

