# Localore

Localore is a Gemini-only destination discovery prototype for PromptWars. It generates animated story cards for a place, recommends cultural experiences and hidden gems, teaches local phrases, and optionally creates a Gemini image for each card.

## Why it fits the challenge

- Destination discovery: attractions, hidden gems, event ideas, and day-flow recommendations.
- Cultural experience: heritage context, etiquette, and local phrase practice are embedded into the story.
- Immersive storytelling: generated cards unfold with motion, image panels, captions, and phrase prompts.
- Gemini-only AI: all generated text and images use the Gemini Interactions API.
- Evaluation-ready code: TypeScript, input validation, server-side key handling, rate limiting, tests, and accessibility states.

## Run

```bash
npm install
copy .env.example .env
```

Add your Gemini key to `.env`, then run:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Models

The app defaults to the efficient Gemini models shown in the pricing docs:

- Text and structured planning: `gemini-3.1-flash-lite`
- Story card images: `gemini-3.1-flash-lite-image`

You can override either model in `.env`.

## API

The browser calls the local Express server at `POST /api/story`. The server validates the request, calls Gemini with `store: false`, validates the structured response, and only then returns data to the UI. The Gemini API key is never exposed to frontend code.

## Checks

```bash
npm run test
npm run build
```
