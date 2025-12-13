import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export const llm = {
  generate: async (prompt: string): Promise<string> => {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a backend AI assistant. Always return STRICT JSON when asked.",
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

    return text;
  },
};
