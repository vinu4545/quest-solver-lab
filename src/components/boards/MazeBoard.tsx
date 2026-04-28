import { MazeData, Pos } from "@/ai/maze";

const k = (p: Pos) => `${p.r},${p.c}`;

export const MazeBoard = ({ maze, exploredUpTo = [], path = [] }: { maze: MazeData; exploredUpTo?: Pos[]; path?: Pos[] }) => {
  const ex = new Set(exploredUpTo.map(k));
  const pa = new Set(path.map(k));
  const sk = k(maze.start), ek = k(maze.end);
  const cell = Math.max(8, Math.min(22, Math.floor(540 / maze.cols)));
  return (
    <div className="inline-block rounded-lg border border-border bg-background p-1">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${maze.cols}, ${cell}px)` }}>
        {maze.grid.map((row, r) =>
          row.map((v, c) => {
            const key = `${r},${c}`;
            let cls = "bg-background";
            if (v === 1) cls = "bg-[hsl(var(--tile-wall))]";
            else if (key === sk) cls = "bg-[hsl(var(--tile-goal))]";
            else if (key === ek) cls = "bg-accent";
            else if (pa.has(key)) cls = "bg-primary";
            else if (ex.has(key)) cls = "bg-secondary/50";
            return <div key={key} style={{ width: cell, height: cell }} className={`${cls} transition-colors duration-100`} />;
          })
        )}
      </div>
    </div>
  );
};
