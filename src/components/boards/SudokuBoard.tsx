import { Sudoku } from "@/ai/sudoku";

export const SudokuBoard = ({
  puzzle, current, highlight,
}: { puzzle: Sudoku; current?: Sudoku; highlight?: { r: number; c: number; action: "place" | "backtrack" } | null }) => {
  const grid = current ?? puzzle;
  return (
    <div className="inline-grid grid-cols-9 overflow-hidden rounded-lg border-2 border-border bg-muted/20">
      {grid.map((row, r) =>
        row.map((v, c) => {
          const given = puzzle[r][c] !== 0;
          const isHL = highlight && highlight.r === r && highlight.c === c;
          const borderR = c % 3 === 2 && c !== 8 ? "border-r-2 border-r-border" : "border-r border-r-border/50";
          const borderB = r % 3 === 2 && r !== 8 ? "border-b-2 border-b-border" : "border-b border-b-border/50";
          return (
            <div key={`${r}-${c}`}
              className={`grid h-9 w-9 place-items-center font-mono text-base ${borderR} ${borderB}
                ${given ? "bg-card text-foreground" : "bg-background/50 text-primary"}
                ${isHL ? (highlight!.action === "place" ? "!bg-primary/30 ring-2 ring-primary" : "!bg-destructive/30 ring-2 ring-destructive") : ""}`}
            >
              {v !== 0 ? v : ""}
            </div>
          );
        })
      )}
    </div>
  );
};
