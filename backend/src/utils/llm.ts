import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

function stripMarkdown(text: string): string {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

export const llm = {
  generate: async (prompt: string): Promise<string> => {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
            You are a backend AI assistant.
            Return STRICT JSON only.
            Do NOT use markdown.
            Do NOT wrap output in triple backticks.
            Do NOT add explanations.
            `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new Error("LLM returned empty response");
    }

    return stripMarkdown(text);
  },
};
