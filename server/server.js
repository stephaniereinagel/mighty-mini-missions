import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support both `.env` and `env` (some editors block dotfiles).
const envCandidates = [path.resolve(__dirname, ".env"), path.resolve(__dirname, "env")];
for (const p of envCandidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const app = express();
app.use(express.json({ limit: "1mb" }));

// Very small "oops protection" to avoid accidental rapid-fire calls.
/** @type {Map<string, number>} */
const lastCallByIp = new Map();
const MIN_MS_BETWEEN_CALLS = 1500;

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/image", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      res.status(500).json({
        error:
          "Missing OPENAI_API_KEY. Create mighty-mini-missions/server/.env (or `env`) with OPENAI_API_KEY=... then restart the server."
      });
      return;
    }

    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();
    const last = lastCallByIp.get(String(ip)) ?? 0;
    if (now - last < MIN_MS_BETWEEN_CALLS) {
      res.status(429).json({ error: "Too many requests. Wait a second and try again." });
      return;
    }
    lastCallByIp.set(String(ip), now);

    const { prompt } = req.body ?? {};
    if (typeof prompt !== "string" || prompt.trim().length < 5) {
      res.status(400).json({ error: "Missing prompt." });
      return;
    }

    const client = new OpenAI({ apiKey: OPENAI_API_KEY });

    // Keep it kid-friendly, no text in the image, simple “card” illustration style.
    const finalPrompt =
      "Create a simple, kid-friendly illustration for a homeschool mission card. " +
      "Flat, clean shapes, bright but not neon, high contrast, minimal background. " +
      "People are allowed, but keep the focus on the mission action and objects; keep characters simple and stylized with minimal facial detail; do not make ethnicity or skin tone a focal point. " +
      "No words, no letters, no numbers, no logos, no watermarks. " +
      "Prompt: " +
      prompt.trim();

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: finalPrompt,
      size: "1024x1024"
    });

    const data = result?.data?.[0];
    if (data?.b64_json) {
      res.json({ dataUrl: `data:image/png;base64,${data.b64_json}` });
      return;
    }
    if (data?.url) {
      res.json({ url: data.url });
      return;
    }

    res.status(502).json({ error: "Image API returned no image." });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Serve the Mighty Mini Missions static app from the parent folder.
const staticDir = path.resolve(__dirname, "..");
app.use(express.static(staticDir));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Mighty Mini Missions running on http://localhost:${PORT}/`);
});

