/**
 * Client LLM + immagini — OpenAI-compatible
 * Env: OPENAI_API_KEY o EDITORIAL_API_KEY
 *      EDITORIAL_LLM_MODEL (default gpt-4o-mini)
 *      EDITORIAL_IMAGE_MODEL (default dall-e-3)
 */

export function hasApiKey() {
  return !!(process.env.OPENAI_API_KEY || process.env.EDITORIAL_API_KEY);
}

function apiKey() {
  const k = process.env.OPENAI_API_KEY || process.env.EDITORIAL_API_KEY;
  if (!k) throw new Error("OPENAI_API_KEY o EDITORIAL_API_KEY richiesta per autopilot");
  return k;
}

export async function chatJson(system, user) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.EDITORIAL_LLM_MODEL || process.env.EDITORIAL_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.82,
    }),
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LLM ${res.status}: ${err.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "{}";
  return JSON.parse(text);
}

export async function generateImagePng(prompt) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.EDITORIAL_IMAGE_MODEL || "dall-e-3",
      prompt: prompt.slice(0, 4000),
      size: "1792x1024",
      n: 1,
      quality: "standard",
    }),
    signal: AbortSignal.timeout(180000),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Image API ${res.status}: ${err.slice(0, 300)}`);
  }
  const data = await res.json();
  const url = data.data?.[0]?.url;
  if (!url) throw new Error("Image API: nessun URL");
  const imgRes = await fetch(url);
  if (!imgRes.ok) throw new Error("Download immagine fallito");
  return Buffer.from(await imgRes.arrayBuffer());
}
