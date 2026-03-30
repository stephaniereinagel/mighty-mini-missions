import fs from "node:fs/promises";
import path from "node:path";

import fsSync from "node:fs";
import dotenv from "dotenv";
import OpenAI from "openai";

// Support both `.env` and `env` (some editors block dotfiles).
const envCandidates = [path.resolve(process.cwd(), ".env"), path.resolve(process.cwd(), "env")];
for (const p of envCandidates) {
  if (fsSync.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function parseArgs(argv) {
  const args = { overwrite: false, limit: null, only: null, sleepMs: 300 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--overwrite") args.overwrite = true;
    else if (a === "--limit") args.limit = Number(argv[++i] ?? "0") || null;
    else if (a === "--only") args.only = String(argv[++i] ?? "");
    else if (a === "--sleep-ms") args.sleepMs = Math.max(0, Number(argv[++i] ?? "0") || 0);
  }
  return args;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function sanitizeText(s) {
  return String(s)
    .replace(/\{\{\w+\}\}/g, "something")
    .replace(/\b\d+\b/g, "some")
    .trim();
}

function buildPrompt(m) {
  const parts = [
    `Mission title: ${sanitizeText(m.title)}`,
    `Mission: ${sanitizeText(m.prompt)}`,
    Array.isArray(m.materials) && m.materials.length
      ? `Materials: ${m.materials.slice(0, 6).map(sanitizeText).join(", ")}`
      : "",
    Array.isArray(m.steps) && m.steps.length ? `Steps: ${m.steps.slice(0, 4).map(sanitizeText).join(". ")}` : "",
    "Make it concrete and action-focused."
  ].filter(Boolean);
  return parts.join("\n");
}

async function main() {
  if (!OPENAI_API_KEY) {
    console.error(
      "Missing OPENAI_API_KEY. Create mighty-mini-missions/server/.env (or `env`) with OPENAI_API_KEY=... then rerun."
    );
    process.exitCode = 1;
    return;
  }

  const args = parseArgs(process.argv.slice(2));

  const serverDir = path.resolve(process.cwd());
  const appDir = path.resolve(serverDir, "..");
  const missionsPath = path.resolve(appDir, "missions.json");
  const outDir = path.resolve(appDir, "illustrations");

  await fs.mkdir(outDir, { recursive: true });

  const raw = await fs.readFile(missionsPath, "utf8");
  const data = JSON.parse(raw);
  const missions = Array.isArray(data.missions) ? data.missions : [];
  const selected = args.only ? missions.filter((m) => m.id === args.only) : missions;
  const list = args.limit ? selected.slice(0, args.limit) : selected;

  if (!list.length) {
    console.log("No missions selected.");
    return;
  }

  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  let done = 0;
  for (const m of list) {
    const outPath = path.resolve(outDir, `${m.id}.png`);
    const rel = path.relative(appDir, outPath);
    const exists = await fs
      .access(outPath)
      .then(() => true)
      .catch(() => false);

    if (exists && !args.overwrite) {
      done++;
      console.log(`[${done}/${list.length}] skip (exists) ${rel}`);
      continue;
    }

    const finalPrompt =
      "Create a simple, kid-friendly illustration for a homeschool mission card. " +
      "Flat, clean shapes, bright but not neon, high contrast, minimal background. " +
      "People are allowed, but keep the focus on the mission action and objects; keep characters simple and stylized with minimal facial detail; do not make ethnicity or skin tone a focal point. " +
      "No words, no letters, no numbers, no logos, no watermarks. " +
      "Prompt: " +
      buildPrompt(m);

    console.log(`[${done + 1}/${list.length}] generating ${rel} …`);
    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: finalPrompt,
      size: "1024x1024"
    });

    const d = result?.data?.[0];
    if (!d?.b64_json) {
      throw new Error(`No b64_json returned for mission ${m.id}`);
    }

    const buf = Buffer.from(d.b64_json, "base64");
    await fs.writeFile(outPath, buf);
    done++;
    console.log(`[${done}/${list.length}] wrote ${rel}`);

    if (args.sleepMs) await sleep(args.sleepMs);
  }

  console.log(`Done. Generated ${done} illustrations in ${path.relative(process.cwd(), outDir)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

