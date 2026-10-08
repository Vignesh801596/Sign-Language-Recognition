import { useState } from "react";
import { Clock3, History, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sessionStats, useSessionStats, type HistoryEntry } from "@/lib/session-stats";
import { Button } from "@/components/ui/button";

function formatTime(at: number) {
  return new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function HistoryPanel({ expanded = false }: { expanded?: boolean }) {
  const { history } = useSessionStats();
  const [selected, setSelected] = useState<HistoryEntry | null>(null);

  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-5 py-4 sm:px-6">
          <History className="size-4 text-primary" />
          <h2 className="font-semibold">Recognition History</h2>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sessionStats.clearHistory()}
            className="mr-3 text-muted-foreground"
          >
            <Trash2 /> Clear History
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="border-t border-border px-6 py-14 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-md bg-secondary text-muted-foreground">
            <History className="size-5" />
          </span>
          <p className="mt-4 text-sm font-medium">No recognitions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Successful results from this session will appear here.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border border-t border-border">
          {history.slice(0, expanded ? history.length : 4).map((entry) => (
            <li key={entry.id}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSelected(entry)}
                className="h-auto w-full justify-start rounded-none px-4 py-4 text-left hover:bg-accent sm:px-6"
              >
                <img
                  src={entry.thumbnail}
                  alt={`Uploaded image predicted as ${entry.sign}`}
                  loading="lazy"
                  className="size-14 shrink-0 rounded-md border border-border bg-secondary object-cover"
                />
                <div className="min-w-0 flex-1 whitespace-normal">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold">{entry.sign}</p>
                    <span className="rounded-sm bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{entry.signType}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{entry.representation}</p>
                </div>
                <div className="ml-auto shrink-0 text-right">
                  <p className="text-sm font-medium">{(entry.confidence * 100).toFixed(1)}%</p>
                  <p className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground"><Clock3 className="size-3" />{formatTime(entry.at)}</p>
                </div>
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Recognition detail</DialogTitle>
                <DialogDescription>Recognized at {formatTime(selected.at)}</DialogDescription>
              </DialogHeader>
              <img
                src={selected.thumbnail}
                alt={`Uploaded image predicted as ${selected.sign}`}
                  className="max-h-64 w-full rounded-md border border-border bg-secondary object-contain"
              />
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">
                    Predicted Sign
                  </dt>
                  <dd className="mt-0.5 text-3xl font-semibold">{selected.sign}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">Sign Type</dt>
                  <dd className="mt-0.5 text-sm font-medium">{selected.signType}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">What This Sign Represents</dt>
                  <dd className="mt-0.5 text-sm">{selected.representation}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">
                    Confidence
                  </dt>
                  <dd className="mt-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.round(selected.confidence * 100)}%` }}
                      />
                    </div>
                    <span className="mt-1 block text-sm font-medium">
                      {(selected.confidence * 100).toFixed(1)}%
                    </span>
                  </dd>
                </div>
                {selected.alternatives.length > 0 && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">
                      Other Possible Signs
                    </dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {selected.alternatives.map((alt) => (
                        <span
                          key={alt.sign}
                          className="rounded-md bg-secondary px-2.5 py-1 text-sm"
                        >
                          {alt.sign} · {(alt.confidence * 100).toFixed(1)}%
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
