# SignSpeak AI — Sign Language Recognition

**Internship ID:** CITS9005  
**Organization:** CodeTech IT Solutions

SignSpeak AI is an AI-powered sign language recognition web application that uses computer vision to recognize hand signs from an uploaded image or a captured camera frame.

## Features

- Sign recognition from uploaded images
- Camera-based sign recognition
- ASL alphabet recognition (A–Z)
- ASL number recognition (0–9)
- Common word gesture recognition
- Confidence score
- Alternative predictions
- Recognition history
- Responsive user interface
- Dashboard with recognition statistics

## How It Works

1. Upload a clear hand-sign image or use the camera.
2. Preview the selected or captured image.
3. Click **Recognize Sign**.
4. AI vision inference analyzes the image.
5. The application displays the predicted sign, representation, confidence score, and alternative predictions.
6. Successful recognition results can be viewed in the dashboard and history.

## Tech Stack

- React
- TypeScript
- TanStack Start
- TanStack Router
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide React
- Lovable AI Gateway
- AI Vision / Computer Vision

## Project Structure

```text
signspeak-ai/
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── routes/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
