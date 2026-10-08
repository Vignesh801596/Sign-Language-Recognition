import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  History,
  Menu,
  ScanLine,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/recognize", label: "Sign Recognition", icon: ScanLine },
  { to: "/history", label: "Recognition History", icon: History },
  { to: "/about", label: "About Project", icon: BookOpen },
] as const;

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <BrainCircuit className="size-5" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block font-semibold text-sidebar-foreground">SignSpeak AI</span>
        <span className="block text-xs text-muted-foreground">Sign Language Recognition</span>
      </span>
    </Link>
  );
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Primary navigation" className="space-y-1">
      {links.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/" }}
          onClick={onNavigate}
          className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <div className="border-b border-sidebar-border p-5">
          <Brand />
        </div>
        <div className="flex-1 p-4">
          <p className="mb-3 px-3 text-xs font-medium uppercase text-muted-foreground">Workspace</p>
          <Navigation />
        </div>
        <div className="border-t border-sidebar-border p-5">
          <p className="text-xs font-medium text-sidebar-foreground">CodeTech AI Internship</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Computer vision project · Session data only</p>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:col-start-2 lg:px-8">
        <div className="lg:hidden">
          <Brand />
        </div>
        <div className="hidden lg:block">
          <p className="text-sm font-medium">AI Recognition Workspace</p>
          <p className="text-xs text-muted-foreground">ASL alphabet and number classification</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-10 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={`fixed inset-x-0 top-16 z-20 border-b border-sidebar-border bg-sidebar p-4 shadow-sm transition-transform lg:hidden ${mobileOpen ? "translate-y-0" : "-translate-y-[150%]"}`}
      >
        <Navigation onNavigate={() => setMobileOpen(false)} />
      </aside>

      <main className="min-w-0 lg:col-start-2">{children}</main>
    </div>
  );
}