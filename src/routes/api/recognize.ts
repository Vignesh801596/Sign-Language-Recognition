import { createFileRoute } from "@tanstack/react-router";

type Prediction = {
  is_hand_sign: boolean;
  sign: string;
  sign_kind: "letter" | "digit" | "word";
  confidence: number;
  alternatives: { sign: string; confidence: number }[];
};

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["is_hand_sign", "sign", "sign_kind", "confidence", "alternatives"],
  properties: {
    is_hand_sign: {
      type: "boolean",
      description: "True only if the image clearly shows a hand forming a sign-language gesture.",
    },
    sign: {
      type: "string",
      description:
        "The recognized sign: an ASL letter (A-Z), a digit (0-9), or one of the common word gestures HELLO, THANK YOU, SORRY, YES, NO, PLEASE, HELP, MORE, ALL DONE, I LOVE YOU. Empty string if not recognizable.",
    },
    sign_kind: {
      type: "string",
      enum: ["letter", "digit", "word"],
      description: "Whether the recognized sign is an alphabet letter, a digit, or a common word gesture.",
    },
    confidence: {
      type: "number",
      description: "Confidence between 0 and 1 for the top prediction.",
    },
    alternatives: {
      type: "array",
      description: "Up to 3 next-most-likely signs, most likely first. Empty array if none.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["sign", "confidence"],
        properties: {
          sign: { type: "string" },
          confidence: { type: "number" },
        },
      },
    },
  },
} as const;

const WORD_SIGNS = [
  "HELLO",
  "THANK YOU",
  "SORRY",
  "YES",
  "NO",
  "PLEASE",
  "HELP",
  "MORE",
  "ALL DONE",
  "I LOVE YOU",
] as const;

const INSTRUCTIONS =
  "You are an American Sign Language (ASL) classifier. " +
  "Examine the hand(s) in the image: finger extension, thumb position, palm orientation and knuckle shape. " +
  "Classify it as one of: (a) an ASL alphabet letter A-Z, (b) an ASL digit 0-9, or (c) one of these common word gestures: " +
  "HELLO (open hand near the head, as in a greeting wave), " +
  "THANK YOU (fingers extended forward from the chin), " +
  "SORRY (fist held on the chest, circular apology motion), " +
  "YES (closed fist nodding up and down like a nodding head), " +
  "NO (index and middle finger extended, tapping toward the thumb), " +
  "PLEASE (flat open hand held on the chest), " +
  "HELP (closed fist resting on an open palm), " +
  "MORE (fingertips of both hands brought together), " +
  "ALL DONE (both open hands held up and moving outward), " +
  "I LOVE YOU (thumb, index finger and pinky extended, middle and ring fingers folded). " +
  "For word gestures, set sign_kind to 'word'; for letters 'letter'; for digits 'digit'. " +
  "A single static photo cannot capture motion, so judge word gestures by the visible hand/body configuration " +
  "and lower confidence when the pose is ambiguous with a letter or another gesture. " +
  "Report calibrated confidence: use lower values when the hand is blurred, cropped or ambiguous. " +
  "If the image contains no hand forming a sign, set is_hand_sign to false, sign to an empty string, " +
  "sign_kind to 'letter', confidence to 0 and alternatives to an empty array.";

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export const Route = createFileRoute("/api/recognize")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return bad("AI service is not configured.", 500);

        let body: { image?: unknown };
        try {
          body = (await request.json()) as { image?: unknown };
        } catch {
          return bad("Invalid request body.");
        }

        const image = body.image;
        if (typeof image !== "string" || !image.startsWith("data:image/")) {
          return bad("Please upload a valid image file (PNG, JPG or WEBP).");
        }
        if (image.length > 8_000_000) {
          return bad("Image is too large. Please use an image under 5 MB.");
        }

        let upstream: Response;
        try {
          upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": apiKey,
              "X-Lovable-AIG-SDK": "fetch",
            },
            body: JSON.stringify({
              model: "openai/gpt-6-astra",
              stream: true,
              instructions: INSTRUCTIONS,
              reasoning: { effort: "low", summary: "auto" },
              text: {
                format: {
                  type: "json_schema",
                  name: "asl_prediction",
                  strict: true,
                  schema: SCHEMA,
                },
              },
              input: [
                {
                  role: "user",
                  content: [
                    { type: "input_text", text: "Recognize the sign-language gesture in this image." },
                    { type: "input_image", image_url: image },
                  ],
                },
              ],
            }),
          });
        } catch {
          return bad("Could not reach the recognition service. Please try again.", 502);
        }

        if (!upstream.ok || !upstream.body) {
          const detail = await upstream.text().catch(() => "");
          if (upstream.status === 429)
            return bad("Too many requests right now. Please wait a moment and try again.", 429);
          if (upstream.status === 402)
            return bad("AI usage limit reached for this workspace.", 402);
          console.error("AI gateway error", upstream.status, detail.slice(0, 500));
          return bad("The recognition model could not process this image.", 502);
        }

        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let text = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const event = JSON.parse(payload) as {
                type?: string;
                delta?: string;
                response?: { output_text?: string };
              };
              if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
                text += event.delta;
              } else if (event.type === "response.completed" && event.response?.output_text) {
                text = event.response.output_text;
              }
            } catch {
              /* ignore keep-alive / partial frames */
            }
          }
        }

        let parsed: Prediction;
        try {
          parsed = JSON.parse(text.trim()) as Prediction;
        } catch {
          return bad("The model returned an unreadable result. Please try another image.", 502);
        }

        if (!parsed.is_hand_sign || !parsed.sign) {
          return bad(
            "No sign-language hand gesture was detected. Please upload a clear photo of a single hand sign.",
            422,
          );
        }

        const clamp = (n: unknown) =>
          typeof n === "number" && Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;

        const sign = parsed.sign.trim().toUpperCase().replace(/\s+/g, " ");
        const isLetter = /^[A-Z]$/.test(sign);
        const isDigit = /^[0-9]$/.test(sign);
        const isWord = (WORD_SIGNS as readonly string[]).includes(sign);
        if (!isLetter && !isDigit && !isWord) {
          return bad(
            "The model returned a sign outside its supported A–Z, 0–9 and common word-gesture classes.",
            502,
          );
        }

        const WORD_MEANINGS: Record<string, string> = {
          HELLO: "A greeting gesture — an open hand held near the head, as in a wave.",
          "THANK YOU": "A gesture expressing thanks — fingers extended forward from the chin.",
          SORRY: "An apology gesture — a fist held on the chest with a circular motion.",
          YES: "A gesture of agreement — a closed fist nodding up and down like a nodding head.",
          NO: "A gesture of disagreement — the index and middle finger tapping toward the thumb.",
          PLEASE: "A polite request gesture — a flat open hand held on the chest.",
          HELP: "A gesture asking for help — a closed fist resting on an open palm.",
          MORE: "A gesture asking for an additional amount — the fingertips of both hands brought together.",
          "ALL DONE": "A gesture meaning finished or completed — both open hands moving outward.",
          "I LOVE YOU": "The I-love-you gesture — thumb, index finger and pinky extended.",
        };

        const signType = isWord ? "Common Word Gesture" : isLetter ? "ASL Alphabet" : "ASL Number";
        const representation = isWord
          ? `${WORD_MEANINGS[sign]} Note: a single photo captures only the hand/body configuration — the motion of this sign cannot be verified from a static image.`
          : isLetter
            ? `The letter ${sign} in American Sign Language.`
            : `The number ${sign} in American Sign Language.`;

        const validAlt = (s: string) =>
          /^[A-Z0-9]$/.test(s) || (WORD_SIGNS as readonly string[]).includes(s);

        return Response.json({
          sign,
          signType,
          representation,
          confidence: clamp(parsed.confidence),
          alternatives: (Array.isArray(parsed.alternatives) ? parsed.alternatives : [])
            .map((a) => ({ ...a, sign: a.sign.trim().toUpperCase().replace(/\s+/g, " ") }))
            .filter((a) => validAlt(a.sign) && a.sign !== sign)
            .slice(0, 3)
            .map((a) => ({ sign: a.sign, confidence: clamp(a.confidence) })),
        });
      },
    },
  },
});
