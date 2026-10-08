import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";

import { HistoryPanel } from "@/components/history-panel";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Recognition History | SignSpeak AI" },
      {
        name: "description",
        content: "Review sign language predictions, uploaded images, confidence scores and timestamps from this browser session.",
      },
      { property: "og:title", content: "Recognition History | SignSpeak AI" },
      {
        property: "og:description",
        content: "Review recent ASL alphabet and number recognition results from this session.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <History className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold">Recognition History</h1>
          <p className="mt-1 text-sm text-muted-foreground">Successful results from your current browser session.</p>
        </div>
      </div>
      <div className="mt-7">
        <HistoryPanel expanded />
      </div>
    </div>
  );
}