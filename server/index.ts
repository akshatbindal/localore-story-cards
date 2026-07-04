import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ZodError } from "zod";
import { buildDemoStory } from "./demo";
import { generateStory } from "./gemini";
import { storyRequestSchema } from "./schemas";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);
const dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.resolve(dirname, "../dist");
const requestWindowMs = 60_000;
const maxRequestsPerWindow = 12;
const storyCacheTtlMs = 10 * 60_000;
const storyCacheMaxEntries = 8;
const buckets = new Map<string, { count: number; resetAt: number }>();
const storyCache = new Map<string, { expiresAt: number; story: unknown }>();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173"
  })
);
app.use(express.json({ limit: "24kb" }));
app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; connect-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'"
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const key = req.ip || "anonymous";
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + requestWindowMs });
    next();
    return;
  }

  if (current.count >= maxRequestsPerWindow) {
    res.status(429).json({ message: "Too many story requests. Please wait a minute and try again." });
    return;
  }

  current.count += 1;
  next();
}

function getCacheKey(value: unknown) {
  return JSON.stringify(value);
}

function getCachedStory(key: string) {
  const cached = storyCache.get(key);
  if (!cached) {
    return undefined;
  }

  if (cached.expiresAt <= Date.now()) {
    storyCache.delete(key);
    return undefined;
  }

  return cached.story;
}

function cacheStory(key: string, story: unknown) {
  if (storyCache.size >= storyCacheMaxEntries) {
    const oldestKey = storyCache.keys().next().value;
    if (oldestKey) {
      storyCache.delete(oldestKey);
    }
  }

  storyCache.set(key, { expiresAt: Date.now() + storyCacheTtlMs, story });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/story", rateLimit, async (req, res) => {
  try {
    const storyRequest = storyRequestSchema.parse(req.body);
    const cacheKey = getCacheKey(storyRequest);
    const cached = getCachedStory(cacheKey);

    if (cached) {
      res.setHeader("X-Localore-Cache", "HIT");
      res.json(cached);
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      const story = buildDemoStory();
      cacheStory(cacheKey, story);
      res.setHeader("X-Localore-Cache", "MISS");
      res.json(story);
      return;
    }

    const story = await generateStory(storyRequest);
    cacheStory(cacheKey, story);
    res.setHeader("X-Localore-Cache", "MISS");
    res.json(story);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: "Invalid story request.", details: error.flatten() });
      return;
    }

    console.error(error);
    res.status(502).json({
      message: error instanceof Error ? error.message : "Gemini story generation failed."
    });
  }
});

app.use(express.static(staticDir, { maxAge: "1h", etag: true, index: false }));
app.get("*", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Localore API listening on http://localhost:${port}`);
});
