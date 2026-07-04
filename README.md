# Localore

Localore is a Gemini-only destination discovery prototype for PromptWars. It generates animated story cards for a place, recommends cultural experiences and hidden gems, teaches local phrases, and optionally creates a Gemini image for each card.

## Problem Statement Alignment

PromptWars asks for a GenAI-powered platform that helps travelers discover destinations and engage with local culture in meaningful ways. Localore maps directly to that brief:

- **Recommend attractions:** each generated journey includes recognizable places, a best-time cue, and a day-flow structure.
- **Uncover hidden gems:** every story card has a hidden-gem recommendation, plus a dedicated hidden-gems list.
- **Generate immersive storytelling:** the destination unfolds as animated story cards with narrative, cultural context, and Gemini-generated image cards.
- **Promote heritage:** cards include respectful cultural insights, etiquette guidance, and safety notes.
- **Suggest local events:** the response includes event ideas phrased safely when exact dates are unknown.
- **Connect visitors with authentic culture:** each card teaches a local phrase with transliteration, meaning, and usage context.

## Why it fits the challenge

- Destination discovery: attractions, hidden gems, event ideas, and day-flow recommendations.
- Cultural experience: heritage context, etiquette, and local phrase practice are embedded into the story.
- Immersive storytelling: generated cards unfold with motion, image panels, captions, and phrase prompts.
- Gemini-only AI: all generated text and images use the Gemini Interactions API.
- Evaluation-ready code: TypeScript, input validation, server-side key handling, rate limiting, tests, and accessibility states.

## GCP Architecture

- **Cloud Run:** hosts the full-stack app as one container, serving both the React frontend and Express API.
- **Gemini Interactions API:** generates structured travel stories, phrasebooks, hidden gems, etiquette, and image cards.
- **Environment variables / Secret Manager ready:** the Gemini API key stays server-side and can be configured from Google Cloud Console.
- **Production safeguards:** request validation, rate limiting, response caching, security headers, and graceful demo mode when no key is configured.

## Evaluation Signals

- **Code quality:** modular React components, shared schemas, typed request/response contracts, and clear server boundaries.
- **Security:** API key never reaches the browser, CORS is scoped, payload size is limited, and security headers are set.
- **Efficiency:** cached story responses, bounded image-generation concurrency, request timeouts, and static asset caching.
- **Testing:** schema, UI, helper, and storage tests cover the highest-risk behavior.
- **Accessibility:** semantic navigation, keyboard-reachable card controls, alt text, focus styles, `aria-live`, and reduced-motion support.

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
