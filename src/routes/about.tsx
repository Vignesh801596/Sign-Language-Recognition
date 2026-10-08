import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Camera, CheckCircle2, Cpu, Image, Layers3, ScanLine, Shapes } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Project | SignSpeak AI" },
      { name: "description", content: "Learn how the SignSpeak AI internship project classifies supported ASL alphabet and number signs from uploaded images." },
      { property: "og:title", content: "About SignSpeak AI" },
      { property: "og:description", content: "A CodeTech AI internship project for ASL fingerspelling recognition using computer vision." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const technologies = [
  { name: "Artificial Intelligence", detail: "Vision-based inference", icon: BrainCircuit },
  { name: "Machine Learning", detail: "Pretrained classification model", icon: Cpu },
  { name: "Computer Vision", detail: "Hand-shape image analysis", icon: Camera },
  { name: "Image Classification", detail: "Supported-class prediction", icon: Shapes },
];

const steps = [
  { name: "Upload Image", icon: Image },
  { name: "Image Preprocessing", icon: Layers3 },
  { name: "AI Model", icon: BrainCircuit },
  { name: "Sign Classification", icon: ScanLine },
  { name: "Predicted Sign", icon: Shapes },
  { name: "Meaning / Representation", icon: CheckCircle2 },
  { name: "Confidence Score", icon: Cpu },
];

function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-primary">About Project</p>
        <h1 className="mt-1 text-3xl font-semibold">SignSpeak AI</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          A CodeTech AI internship project built to recognize supported American Sign Language fingerspelling classes from uploaded images.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Purpose</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Sign language recognition applies artificial intelligence and computer vision to identify hand shapes. SignSpeak AI focuses specifically on static ASL fingerspelling: alphabet letters A–Z and numbers 0–9. It does not claim to recognize full words, actions, or continuous signing.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            The system analyzes one uploaded image, maps the model output to a supported class, and reports the predicted sign with a confidence score and a factual representation of that class.
          </p>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Supported Recognition</h2>
          <dl className="mt-4 space-y-4">
            <div className="border-l-2 border-primary pl-4"><dt className="text-sm font-semibold">ASL Alphabet</dt><dd className="mt-1 text-sm text-muted-foreground">Static fingerspelling letters A through Z</dd></div>
            <div className="border-l-2 border-primary pl-4"><dt className="text-sm font-semibold">ASL Numbers</dt><dd className="mt-1 text-sm text-muted-foreground">Supported number hand shapes 0 through 9</dd></div>
            <div className="border-l-2 border-border pl-4"><dt className="text-sm font-semibold">Input</dt><dd className="mt-1 text-sm text-muted-foreground">A clear image showing one hand sign</dd></div>
          </dl>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Technology</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {technologies.map(({ name, detail, icon: Icon }) => (
            <div key={name} className="rounded-md border border-border p-4">
              <Icon className="size-5 text-primary" /><p className="mt-3 text-sm font-semibold">{name}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Methodology</h2>
        <p className="mt-1 text-sm text-muted-foreground">How the model behind this app was built and deployed</p>
        <ol className="mt-4 space-y-4">
          <li className="border-l-2 border-primary pl-4">
            <p className="text-sm font-semibold">1. Data collection</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Labeled datasets of ASL alphabet hand shapes (A–Z) and digits (0–9) were gathered, covering one static hand sign per class.</p>
          </li>
          <li className="border-l-2 border-primary pl-4">
            <p className="text-sm font-semibold">2. Preprocessing</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Each image is resized to the model's expected input size, normalized to a consistent numeric range, and converted to the color format the model was trained on.</p>
          </li>
          <li className="border-l-2 border-primary pl-4">
            <p className="text-sm font-semibold">3. Offline training</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Model training happens offline on GPU compute with the labeled datasets — it is not performed in this app or in the browser.</p>
          </li>
          <li className="border-l-2 border-primary pl-4">
            <p className="text-sm font-semibold">4. Web inference deployment</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">The resulting pretrained model is deployed behind this web app: uploaded images run through real inference to produce the prediction and confidence score shown on the Sign Recognition page.</p>
          </li>
        </ol>
        <div className="mt-6 rounded-md border border-border bg-secondary p-4">
          <p className="text-sm font-semibold">Limitations</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">This is a static-image model. Dynamic, word-level, or continuous signs require video or hand-keypoint sequence data and are not recognized by this project — they are intentionally out of scope rather than simulated.</p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <div><h2 className="text-lg font-semibold">Recognition Workflow</h2><p className="mt-1 text-sm text-muted-foreground">From image input to an interpretable result</p></div>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {steps.map(({ name, icon: Icon }, index) => (
            <li key={name} className="relative rounded-md border border-border p-4 text-center">
              <span className="mx-auto flex size-9 items-center justify-center rounded-md bg-secondary text-primary"><Icon className="size-4" /></span>
              <p className="mt-3 text-xs font-medium leading-relaxed">{name}</p>
              <span className="absolute left-2 top-2 text-[10px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}