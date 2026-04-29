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
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-border/70 bg-muted/60 px-1 backdrop-blur transition-colors hover:bg-muted"
    >
      <Moon className={`ml-1 h-4 w-4 transition-opacity ${isDark ? "opacity-100 text-primary" : "opacity-30"}`} />
      <span
        className={`absolute inset-y-1 left-1 grid h-7 w-7 place-items-center rounded-full border border-border/60 bg-background text-foreground shadow-[0_8px_18px_-8px_hsl(240_50%_2%/0.45)] transition-transform duration-300 ${
          isDark ? "translate-x-0" : "translate-x-6"
        }`}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
      <Sun className={`ml-auto mr-1 h-4 w-4 transition-opacity ${isDark ? "opacity-30" : "opacity-100 text-primary"}`} />
    </button>
  );
};
