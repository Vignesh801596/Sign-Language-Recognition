import { Link } from "@tanstack/react-router";
import { Hand } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/recognize", label: "Sign Recognition" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Hand className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-semibold tracking-tight text-foreground">SignSpeak AI</span>
            <span className="block text-xs text-muted-foreground">Sign Language Recognition</span>
          </span>
        </Link>
        <nav className="flex flex-wrap gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
