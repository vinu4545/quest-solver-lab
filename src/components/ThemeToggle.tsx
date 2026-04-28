import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/state/theme";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative inline-flex h-8 w-14 items-center rounded-full border border-border/70 bg-muted/60 px-1 backdrop-blur transition-colors hover:bg-muted"
    >
      <span
        className={`absolute inset-y-1 left-1 grid h-6 w-6 place-items-center rounded-full bg-gradient-rainbow text-primary-foreground shadow-glow-primary transition-transform duration-300 ${
          isDark ? "translate-x-0" : "translate-x-6"
        }`}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
      <Sun className={`ml-auto mr-1 h-3.5 w-3.5 transition-opacity ${isDark ? "opacity-40" : "opacity-0"}`} />
    </button>
  );
};
