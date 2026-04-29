import { Board } from "@/backend/ai/eightPuzzle";

export const EightPuzzleBoard = ({ board, highlightZero = true, justMoved }: { board: Board; highlightZero?: boolean; justMoved?: number | null }) => (
  <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-2 dark:gap-3 dark:rounded-2xl dark:border dark:border-border/90 dark:bg-background/80 dark:p-3 dark:shadow-[0_24px_60px_-28px_hsl(240_50%_2%/0.7)]">
    {board.map((v, i) => {
      const isBlank = v === 0;
      const moved = justMoved === i;
      return (
        <div key={i}
          className={`relative grid aspect-square place-items-center rounded-lg border border-border font-mono text-2xl font-bold transition-all duration-300
            ${isBlank ? (highlightZero ? "border-dashed bg-background/30 dark:border-border/80 dark:bg-muted/20" : "border-transparent bg-transparent") : "bg-card dark:border-border/90 dark:bg-card/95 dark:shadow-[inset_0_1px_0_hsl(0_0%_100%/0.04)]"}
            ${moved ? "ring-2 ring-primary dark:shadow-[0_0_0_1px_hsl(var(--primary)/0.35),var(--glow-primary)]" : ""}
          `}
        >
          {!isBlank && <span className={moved ? "text-primary" : "text-foreground"}>{v}</span>}
        </div>
      );
    })}
  </div>
);
