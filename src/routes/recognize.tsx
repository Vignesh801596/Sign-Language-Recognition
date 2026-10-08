import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { AlertCircle, Camera, CheckCircle2, ImagePlus, Loader2, RefreshCw, ScanLine, Trash2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { sessionStats, type RecognitionResult } from "@/lib/session-stats";

export const Route = createFileRoute("/recognize")({
  head: () => ({
    meta: [
      { title: "Sign Recognition | SignSpeak AI" },
      { name: "description", content: "Upload an ASL fingerspelling image for AI classification with sign type, representation and confidence." },
      { property: "og:title", content: "Sign Recognition | SignSpeak AI" },
      { property: "og:description", content: "Classify an uploaded ASL alphabet or number hand sign using AI vision." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Recognize,
});

const MAX_BYTES = 5 * 1024 * 1024;
const MIN_CONFIDENCE = 0.6;

function Recognize() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [lowConfidence, setLowConfidence] = useState(false);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  useEffect(() => stopCamera, []);

  useEffect(() => {
    if (!cameraOn) return;
    const video = videoRef.current;
    if (video && streamRef.current) {
      video.srcObject = streamRef.current;
      video.play().catch(() => {});
    }
  }, [cameraOn]);

  async function startCamera() {
    setResult(null); setError(null); setLowConfidence(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      setCameraOn(true);
    } catch {
      setError("Camera access was denied or is unavailable. Please allow camera permission or upload an image instead.");
    }
  }

  function captureFrame() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPreview(canvas.toDataURL("image/jpeg", 0.9));
    setFileName("Camera capture");
    setResult(null); setError(null); setLowConfidence(false);
    stopCamera();
  }

  function acceptFile(file?: File) {
    setResult(null); setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) { setPreview(null); setFileName(""); setError("That file is not an image. Please upload a PNG, JPG or WEBP file."); return; }
    if (file.size > MAX_BYTES) { setPreview(null); setFileName(""); setError("That image is larger than 5 MB. Please upload a smaller image."); return; }
    const reader = new FileReader();
    reader.onerror = () => setError("The image could not be read. Please try a different file.");
    reader.onload = () => { setPreview(String(reader.result)); setFileName(file.name); };
    reader.readAsDataURL(file);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); acceptFile(event.dataTransfer.files?.[0]); }

  async function recognize() {
    if (!preview) return;
    setLoading(true); setError(null); setResult(null); setLowConfidence(false); sessionStats.start();
    try {
      const response = await fetch("/api/recognize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: preview }) });
      const data = (await response.json()) as RecognitionResult & { error?: string };
      if (!response.ok) { const message = data.error ?? "Recognition failed. Please try again."; setError(message); sessionStats.failure(message); return; }
      if (data.confidence < MIN_CONFIDENCE) { setLowConfidence(true); sessionStats.failure("Unable to recognize this sign (confidence below 60%)."); return; }
      setResult(data); sessionStats.success(data, preview);
    } catch { const message = "Network error while contacting the recognition service."; setError(message); sessionStats.failure(message); }
    finally { setLoading(false); }
  }

  function clearAll() { stopCamera(); setPreview(null); setFileName(""); setResult(null); setError(null); setLowConfidence(false); if (inputRef.current) inputRef.current.value = ""; sessionStats.reset(); }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div><p className="text-sm font-medium text-primary">Recognition Workspace</p><h1 className="mt-1 text-2xl font-semibold">Sign Recognition</h1><p className="mt-2 text-sm text-muted-foreground">Upload a clear image of one ASL alphabet or number hand sign.</p></div>
      <div className="mt-7 grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <section className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4 sm:px-6"><h2 className="font-semibold">Upload Sign Image</h2><p className="mt-1 text-xs text-muted-foreground">Use a well-lit image with the hand clearly visible.</p></div>
          <div className="p-5 sm:p-6">
            {cameraOn ? (
              <div className="space-y-3">
                <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-md border border-border bg-secondary/50"><video ref={videoRef} autoPlay playsInline muted className="max-h-[420px] w-full object-contain" /></div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <Button variant="outline" onClick={stopCamera}><X /> Close Camera</Button>
                  <Button onClick={captureFrame}><Camera /> Capture</Button>
                </div>
              </div>
            ) : !preview ? (
              <div className="space-y-3">
                <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} onClick={() => inputRef.current?.click()} className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center transition-colors ${dragging ? "border-primary bg-accent" : "border-border bg-background hover:border-primary/60 hover:bg-accent/40"}`}>
                  <span className="flex size-12 items-center justify-center rounded-md bg-secondary text-primary"><Upload className="size-5" /></span>
                  <p className="mt-4 text-sm font-semibold">Drag and drop your sign image</p><p className="mt-1 text-sm text-muted-foreground">or click to browse from your device</p><p className="mt-4 text-xs text-muted-foreground">PNG, JPG or WEBP · Maximum 5 MB</p>
                </div>
                <Button variant="outline" onClick={startCamera} className="w-full"><Camera /> Use Camera</Button>
              </div>
            ) : (
              <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-md border border-border bg-secondary/50 p-3"><img src={preview} alt="Uploaded sign preview" className="max-h-[420px] w-full object-contain" /></div>
            )}
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => acceptFile(e.target.files?.[0])} />
            {preview && <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><ImagePlus className="size-4" /><span className="min-w-0 flex-1 truncate">{fileName}</span><Button variant="ghost" size="sm" onClick={() => { setPreview(null); setFileName(""); setResult(null); setLowConfidence(false); startCamera(); }}><RefreshCw /> Retake</Button><Button variant="ghost" size="sm" onClick={clearAll}><Trash2 /> Remove</Button></div>}
            {error && <div role="alert" className="mt-4 flex gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /><span>{error}</span></div>}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="outline" onClick={clearAll} className="sm:min-w-28">Clear</Button>
              <Button onClick={recognize} disabled={!preview || loading} className="sm:min-w-44">{loading ? <Loader2 className="animate-spin" /> : <ScanLine />}{loading ? "Analyzing Image…" : "Recognize Sign"}</Button>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6"><div><h2 className="font-semibold">Recognition Result</h2><p className="mt-1 text-xs text-muted-foreground">Model classification and confidence</p></div><span className={`rounded-sm px-2.5 py-1 text-xs font-medium ${result ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{loading ? "Analyzing" : result ? "Completed" : error ? "Failed" : "Ready"}</span></div>
          <div className="min-h-[420px] p-5 sm:p-6">
            {loading && <div className="flex min-h-80 flex-col items-center justify-center text-center"><Loader2 className="size-8 animate-spin text-primary" /><p className="mt-4 text-sm font-medium">Analyzing hand shape</p><p className="mt-1 text-sm text-muted-foreground">Running image inference and class mapping…</p></div>}
            {!loading && !result && lowConfidence && <div className="flex min-h-80 flex-col items-center justify-center text-center"><span className="flex size-12 items-center justify-center rounded-md bg-secondary text-muted-foreground"><AlertCircle className="size-5" /></span><p className="mt-4 text-sm font-medium">Sign not recognized. Please upload a clearer hand-sign image.</p><p className="mt-1 max-w-xs text-sm text-muted-foreground">The model's confidence was below 60%. Try a clearer, well-lit image with the hand fully visible.</p><div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row"><Button variant="outline" onClick={clearAll}><Upload /> Upload Another Image</Button><Button onClick={recognize} disabled={!preview}><RefreshCw /> Try Again</Button></div></div>}
            {!loading && !result && !lowConfidence && <div className="flex min-h-80 flex-col items-center justify-center text-center"><span className="flex size-12 items-center justify-center rounded-md bg-secondary text-muted-foreground"><ScanLine className="size-5" /></span><p className="mt-4 text-sm font-medium">No prediction yet</p><p className="mt-1 max-w-xs text-sm text-muted-foreground">Upload an image and select Recognize Sign to view the classification.</p></div>}
            {!loading && result && <div className="space-y-6">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase text-muted-foreground">Predicted Sign</p><p className="mt-2 text-6xl font-semibold">{result.sign}</p></div><CheckCircle2 className="size-6 text-primary" /></div>
              <div className="grid gap-5 border-t border-border pt-5"><div><p className="text-xs uppercase text-muted-foreground">Sign Type</p><p className="mt-1.5 text-sm font-semibold">{result.signType}</p></div><div><p className="text-xs uppercase text-muted-foreground">What This Sign Represents</p><p className="mt-1.5 text-sm leading-relaxed">{result.representation}</p></div></div>
              <div className="border-t border-border pt-5"><div className="flex items-center justify-between"><p className="text-xs uppercase text-muted-foreground">Confidence</p><p className="text-lg font-semibold">{(result.confidence * 100).toFixed(1)}%</p></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(result.confidence * 100)}%` }} /></div></div>
              {result.alternatives.length > 0 && <div className="border-t border-border pt-5"><p className="text-xs uppercase text-muted-foreground">Other Possible Signs</p><div className="mt-3 space-y-2">{result.alternatives.map((alt) => <div key={alt.sign} className="flex items-center justify-between rounded-md bg-secondary px-3 py-2 text-sm"><span className="font-medium">{alt.sign}</span><span className="text-muted-foreground">{(alt.confidence * 100).toFixed(1)}%</span></div>)}</div></div>}
              <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row"><Button variant="outline" onClick={clearAll}><Upload /> Upload Another Image</Button><Button onClick={recognize} disabled={!preview}><RefreshCw /> Try Again</Button></div>
            </div>}
          </div>
        </section>
      </div>
    </div>
  );
}