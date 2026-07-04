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
const buckets = new Map<string, { count: number; resetAt: number }>();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173"
  })
);
app.use(express.json({ limit: "24kb" }));

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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/story", rateLimit, async (req, res) => {
  try {
    const storyRequest = storyRequestSchema.parse(req.body);

    if (!process.env.GEMINI_API_KEY) {
      res.json(buildDemoStory());
      return;
    }

    const story = await generateStory(storyRequest);
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

app.use(express.static(staticDir));
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Localore API listening on http://localhost:${port}`);
});
