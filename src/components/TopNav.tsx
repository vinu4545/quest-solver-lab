import { NavLink, Link } from "react-router-dom";
import { Brain } from "lucide-react";

const items = [
  { to: "/", label: "Home" },
  { to: "/generate", label: "Generate" },
  { to: "/solve", label: "Solve" },
  { to: "/visualize", label: "Visualize" },
  { to: "/explain", label: "Explain" },
];

export const TopNav = () => (
  <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur">
    <div className="container flex h-14 items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-[var(--glow-primary)]">
          <Brain className="h-4 w-4" />
        </span>
        <span className="font-mono text-sm font-bold tracking-tight">cogni<span className="text-primary">.</span>ai</span>
      </Link>
      <nav className="flex items-center gap-1">
        {items.map((i) => (
          <NavLink key={i.to} to={i.to} end={i.to === "/"}
            className={({ isActive }) =>
              `rounded-md px-3 py-1.5 text-sm transition ${isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
          >
            {i.label}
          </NavLink>
        ))}
      </nav>
    </div>
  </header>
);
