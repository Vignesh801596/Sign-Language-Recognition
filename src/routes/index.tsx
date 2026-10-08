import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowRight, Gauge, ScanLine, Shapes } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSessionStats } from "@/lib/session-stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | SignSpeak AI" },
      { name: "description", content: "Monitor session-based ASL recognition results and start a new sign classification with SignSpeak AI." },
      { property: "og:title", content: "SignSpeak AI — Recognition Dashboard" },
      { property: "og:description", content: "AI-powered ASL alphabet and number recognition using computer vision." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const statIcons = [ScanLine, Shapes, Gauge, Activity];

function Dashboard() {
  const { attempts, last, status, history } = useSessionStats();
  const stats = [
    { label: "Total Recognitions", value: String(attempts) },
    { label: "Last Recognized Sign", value: last?.sign ?? "—" },
    { label: "Last Confidence", value: last ? `${(last.confidence * 100).toFixed(1)}%` : "—" },
    { label: "Recognition Status", value: status },
  ];
  const latest = history[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <section className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Sign Language Recognition</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Welcome to SignSpeak AI</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            AI-powered sign language recognition using computer vision and machine learning.
          </p>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to="/recognize"><ScanLine /> Start Sign Recognition <ArrowRight /></Link>
        </Button>
      </section>

      <section aria-label="Session statistics" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = statIcons[index];
          return (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                {Icon && <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-primary"><Icon className="size-4" /></span>}
              </div>
              <p className="mt-4 text-2xl font-semibold">{stat.value}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-7 overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold">Recent Recognition</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Your latest successful classification</p>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/history">View History <ArrowRight /></Link></Button>
        </div>
        {latest ? (
          <div className="grid gap-6 p-5 sm:grid-cols-[96px_1fr] sm:p-6">
            <img src={latest.thumbnail} alt={`Uploaded sign classified as ${latest.sign}`} className="size-24 rounded-md border border-border bg-secondary object-cover" />
            <div className="grid gap-5 sm:grid-cols-3">
              <div><p className="text-xs uppercase text-muted-foreground">Predicted Sign</p><p className="mt-1 text-3xl font-semibold">{latest.sign}</p></div>
              <div><p className="text-xs uppercase text-muted-foreground">Sign Type</p><p className="mt-1 text-sm font-medium">{latest.signType}</p><p className="mt-1 text-sm text-muted-foreground">{latest.representation}</p></div>
              <div><div className="flex justify-between"><p className="text-xs uppercase text-muted-foreground">Confidence</p><p className="text-sm font-semibold">{(latest.confidence * 100).toFixed(1)}%</p></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(latest.confidence * 100)}%` }} /></div></div>
            </div>
          </div>
        ) : (
          <div className="px-6 py-12 text-center"><ScanLine className="mx-auto size-6 text-muted-foreground" /><p className="mt-3 text-sm font-medium">No recognition results yet</p><p className="mt-1 text-sm text-muted-foreground">Start a recognition to see the latest result here.</p></div>
        )}
      </section>
    </div>
  );
}