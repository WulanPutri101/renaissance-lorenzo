// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Role = "user" | "assistant" | "system";
type Msg = { role: Role; content: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  // Ambil pesan dari body
  const { messages } = req.body as { messages?: Msg[] };

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ reply: "Bad request: messages missing" });
  }

  // Debug log awal
  console.log("=== OPENROUTER DEBUG START ===");
  console.log("OPENROUTER API KEY:", process.env.OPENROUTER_API_KEY ? "TERBACA ✅" : "TIDAK TERBACA ❌");
  console.log("Model:", process.env.OPENROUTER_MODEL || "(tidak diset)");
  console.log("Messages count:", messages.length);

  try {
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat",

        // opsional: batasi max tokens jika perlu
        // max_tokens: 512
      }),
    });

    const data = await resp.json();
    console.log("OpenRouter status:", resp.status);
    console.log("OpenRouter response snippet:", JSON.stringify(data).slice(0, 1000));
    console.log("=== OPENROUTER DEBUG END ===");

    if (!resp.ok) {
      // Bila OpenRouter balikin error, beritahu client pesan errornya
      const errMsg = data?.error?.message || data?.message || "unknown error from OpenRouter";
      return res.status(502).json({ reply: `Error dari OpenRouter: ${errMsg}` });
    }

    // Struktur response bisa bervariasi; mapping yang umum:
    const reply = data?.choices?.[0]?.message?.content
      || data?.choices?.[0]?.text
      || data?.output?.[0]?.content
      || JSON.stringify(data);

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("OPENROUTER FETCH ERROR:", err);
    return res.status(500).json({ reply: "Terjadi kesalahan di server." });
  }
}
