import { Board } from "@/ai/eightPuzzle";

export const EightPuzzleBoard = ({ board, highlightZero = true, justMoved }: { board: Board; highlightZero?: boolean; justMoved?: number | null }) => (
  <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-2">
    {board.map((v, i) => {
      const isBlank = v === 0;
      const moved = justMoved === i;
      return (
        <div key={i}
          className={`relative grid aspect-square place-items-center rounded-lg font-mono text-2xl font-bold transition-all duration-300
            ${isBlank ? (highlightZero ? "bg-background/30 border border-dashed border-border" : "bg-transparent") : "bg-card border border-border"}
            ${moved ? "ring-2 ring-primary shadow-[var(--glow-primary)]" : ""}
          `}
        >
          {!isBlank && <span className={moved ? "text-primary" : "text-foreground"}>{v}</span>}
        </div>
      );
    })}
  </div>
);
