export function normalizeRfp(aiOutput: any) {
  return {
    items: Array.isArray(aiOutput.items)
      ? aiOutput.items.map((item: any) => ({
          item_type: String(item.item_type || "").toLowerCase(),
          quantity: Number(item.quantity) || 0,
          specifications:
            typeof item.specifications === "object"
              ? item.specifications
              : {},
        }))
      : [],

    budget:
      aiOutput.budget !== undefined && !isNaN(Number(aiOutput.budget))
        ? Number(aiOutput.budget)
        : null,

    delivery_days:
      aiOutput.delivery_days !== undefined &&
      !isNaN(Number(aiOutput.delivery_days))
        ? Number(aiOutput.delivery_days)
        : null,

    payment_terms:
      typeof aiOutput.payment_terms === "string"
        ? aiOutput.payment_terms
        : null,

    warranty:
      typeof aiOutput.warranty === "string" ? aiOutput.warranty : null,

    assumptions: Array.isArray(aiOutput.assumptions)
      ? aiOutput.assumptions.map(String)
      : [],
  };
}
