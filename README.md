# SignSpeak AI — Sign Language Recognition

A CodeTech AI internship project that recognizes American Sign Language (ASL) signs from an uploaded image or a captured camera frame. Upload or capture a photo of one hand sign and the app returns the predicted sign, its type, what it represents, and a real confidence score.

## Features

- **Sign Recognition** — upload a PNG/JPG/WEBP image (drag & drop supported) or capture a single frame with your webcam, then run recognition.
- **ASL Alphabet (A–Z)** and **ASL Numbers (0–9)** — fingerspelling and number hand shapes.
- **Common Word Gestures** — HELLO, THANK YOU, SORRY, YES, NO, PLEASE, HELP, MORE, ALL DONE, I LOVE YOU. (Static photos capture the hand/body configuration only; the motion of word signs cannot be verified from a single image.)
- **Predicted sign, sign type, representation, and confidence score** for every recognition, with "Other Possible Signs" when the model provides alternatives.
- **"Unable to recognize this sign" state** when confidence is below 60% or no hand sign is detected — no forced guesses.
- **Dashboard** — session statistics (total recognitions, last sign, last confidence, status) and the latest result.
- **Recognition History** — recent predictions with thumbnails, meanings, and confidence; click any entry for full details. Cleared with "Clear History". Kept in the browser session only — no database.
- **About Project** — purpose, technology, ML methodology, and limitations.
- Responsive, professional dashboard layout for desktop and mobile.

## Tech Stack

- TanStack Start (React 19, TypeScript, file-based routing)
- Vite + Tailwind CSS v4 + shadcn/ui
- AI vision inference via the Lovable AI Gateway (called server-side only)

## Prerequisites

- Node.js 18 or newer (install via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm (comes with Node.js)

## Running Locally

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Then open the app at the printed local URL (default `http://localhost:8080`).

## Environment Variables

- `LOVABLE_API_KEY` — **server-side only**. Used by the recognition API route to call the AI gateway. When running inside Lovable this is injected automatically; for a standalone local setup, create a `.env` file at the project root:

  ```
  LOVABLE_API_KEY=your-key-here
  ```

  Never expose this key in frontend code.

No other environment variables or external services are required. There is no database, authentication, or storage — recognition history is kept in the browser session.

## Project Structure (key files)

| Path | Purpose |
| --- | --- |
| `src/routes/recognize.tsx` | Sign Recognition workspace (upload, camera capture, result) |
| `src/routes/api/recognize.ts` | Recognition API route (validation, model call, class mapping) |
| `src/routes/index.tsx` | Dashboard with session statistics |
| `src/routes/history.tsx` | Full recognition history page |
| `src/routes/about.tsx` | About Project (purpose, methodology, limitations) |
| `src/components/history-panel.tsx` | History list + detail dialog |
| `src/lib/session-stats.ts` | In-memory session statistics store |

## Built With

- TanStack Start
- TypeScript
- React
- Tailwind CSS
