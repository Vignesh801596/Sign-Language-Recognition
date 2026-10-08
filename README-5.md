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
```

## Running Locally

### Install Dependencies

```bash
npm install
```

### Configure Environment Variable

Create a `.env` file in the project root:

```env
LOVABLE_API_KEY=your-api-key-here
```

Do not upload the `.env` file or expose your API key publicly.

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Recognition Limitations

- Clear and well-lit images provide better results.
- The hand should be clearly visible.
- Accuracy can vary depending on lighting, image quality, hand position, and background.
- Dynamic sign-language movements cannot always be verified from a single image.
- Camera recognition requires browser camera permission.
- Recognition history is maintained for the current browser session.

## Privacy

The application does not require user authentication for recognition. Recognition history is maintained in the browser session.

API credentials should remain server-side and must not be committed to GitHub.

## Future Improvements

- Real-time continuous sign-language recognition
- Improved recognition accuracy
- Larger and more diverse datasets
- Support for additional sign languages
- Video-based dynamic gesture recognition
- Advanced hand tracking
- Mobile application support

## Project Purpose

This project demonstrates the practical use of artificial intelligence, computer vision, and modern web technologies for sign-language recognition.

## License

This project is intended for educational and project demonstration purposes.
