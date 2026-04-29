import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSolution } from "@/state/solution";
import { EightPuzzleBoard } from "@/components/boards/EightPuzzleBoard";
import { SudokuBoard } from "@/components/boards/SudokuBoard";
import { MazeBoard } from "@/components/boards/MazeBoard";
import { Pause, Play, SkipBack, SkipForward, RotateCcw, BookOpen } from "lucide-react";
import type { Sudoku } from "@/backend/ai/sudoku";

const cloneGrid = (grid: Sudoku): Sudoku => grid.map((row) => row.slice());

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-lg border border-border bg-muted/30 p-3">
    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="mt-0.5 truncate font-mono text-lg font-bold text-foreground">{value}</div>
  </div>
);

const Visualize = () => {
  const { sol } = useSolution();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(6); // steps/sec
  const timerRef = useRef<number | null>(null);

  const total = useMemo(() => {
    if (!sol) return 0;
    if (sol.type === "8puzzle") return (sol.eightSteps?.length ?? 1) - 1;
    if (sol.type === "sudoku") return (sol.sudokuSteps?.length ?? 1) - 1;
    if (sol.type === "maze") return (sol.mazeOrder?.length ?? 1) - 1;
    return 0;
  }, [sol]);

  useEffect(() => { setI(0); setPlaying(false); }, [sol]);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = window.setInterval(() => {
      setI((x) => {
        if (x >= total) { setPlaying(false); return x; }
        return x + 1;
      });
    }, Math.max(20, 1000 / speed));
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [playing, speed, total]);

  // Sudoku reconstructed grid up to step i
  const sudokuCurrent = useMemo<Sudoku | null>(() => {
    if (!sol || sol.type !== "sudoku" || !sol.sudokuPuzzle || !sol.sudokuSteps) return null;
    const g = cloneGrid(sol.sudokuPuzzle);
    for (let s = 0; s <= i && s < sol.sudokuSteps.length; s++) {
      const st = sol.sudokuSteps[s]; g[st.r][st.c] = st.v;
    }
    return g;
  }, [sol, i]);

  if (!sol) {
    return (
      <main className="container py-16 text-center">
        <h1 className="text-2xl font-bold">No solution to visualize</h1>
        <p className="mt-2 text-muted-foreground">Solve a puzzle first.</p>
        <Button asChild className="mt-4"><Link to="/solve">Go to solver</Link></Button>
      </main>
    );
  }

  const jumpEnd = total;

  return (
    <main className="container py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Step 03 · Visualization</p>
          <h1 className="text-3xl font-bold md:text-4xl">Solution playback</h1>
        </div>
        <Button asChild variant="outline" size="sm"><Link to="/explain"><BookOpen className="mr-2 h-4 w-4" /> Why it works</Link></Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="panel min-h-[440px] space-y-5 p-6">
          <div className="grid place-items-center">
            {sol.type === "8puzzle" && sol.eightSteps && (
              <div className="w-[320px]">
                <EightPuzzleBoard
                  board={sol.eightSteps[i].board}
                  justMoved={i > 0 ? sol.eightSteps[i].board.indexOf(0) : null}
                />
                <div className="mt-3 text-center font-mono text-sm text-muted-foreground">
                  Move {i}/{total} · <span className="text-primary">{sol.eightSteps[i].move}</span>
                </div>
              </div>
            )}
            {sol.type === "sudoku" && sudokuCurrent && sol.sudokuPuzzle && sol.sudokuSteps && (
              <div>
                <SudokuBoard puzzle={sol.sudokuPuzzle} current={sudokuCurrent} highlight={sol.sudokuSteps[i] ?? null} />
                <div className="mt-3 text-center font-mono text-sm text-muted-foreground">
                  Step {i}/{total} ·{" "}
                  <span className={sol.sudokuSteps[i]?.action === "place" ? "text-primary" : "text-destructive"}>
                    {sol.sudokuSteps[i]?.action === "place"
                      ? `Place ${sol.sudokuSteps[i].v} @ (${sol.sudokuSteps[i].r + 1},${sol.sudokuSteps[i].c + 1})`
                      : `Backtrack @ (${sol.sudokuSteps[i].r + 1},${sol.sudokuSteps[i].c + 1})`}
                  </span>
                </div>
              </div>
            )}
            {sol.type === "maze" && sol.maze && sol.mazeOrder && (
              <div>
                <MazeBoard
                  maze={sol.maze}
                  exploredUpTo={sol.mazeOrder.slice(0, i + 1)}
                  path={i >= total ? sol.mazePath ?? [] : []}
                />
                <div className="mt-3 text-center font-mono text-sm text-muted-foreground">
                  Explored {Math.min(i + 1, sol.mazeOrder.length)}/{sol.mazeOrder.length}
                  {i >= total && sol.mazePath && <> · path length <span className="text-primary">{sol.mazePath.length}</span></>}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Slider value={[i]} min={0} max={total} step={1} onValueChange={([v]) => setI(v)} />
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => { setPlaying(false); setI(0); }}><RotateCcw className="h-4 w-4" /></Button>
                <Button size="icon" variant="outline" onClick={() => { setPlaying(false); setI((x) => Math.max(0, x - 1)); }}><SkipBack className="h-4 w-4" /></Button>
                <Button size="icon" onClick={() => setPlaying((p) => !p)} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="outline" onClick={() => { setPlaying(false); setI((x) => Math.min(total, x + 1)); }}><SkipForward className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => { setPlaying(false); setI(jumpEnd); }}>End</Button>
              </div>
              <div className="flex w-44 items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Speed</span>
                <Slider value={[speed]} min={1} max={60} step={1} onValueChange={([v]) => setSpeed(v)} />
                <span className="w-8 text-right font-mono text-xs text-muted-foreground">{speed}</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="panel p-5">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Run summary</div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Algorithm" value={sol.algorithm} />
              <Stat label="Found" value={sol.stats.found ? "Yes" : "No"} />
              <Stat label="Solution length" value={sol.stats.steps} />
              <Stat label="Nodes explored" value={sol.stats.nodesExplored.toLocaleString()} />
              <Stat label="Time" value={`${sol.stats.timeMs.toFixed(2)} ms`} />
              <Stat label="Puzzle" value={sol.type === "8puzzle" ? "8-Puzzle" : sol.type === "sudoku" ? "Sudoku" : "Maze"} />
            </div>
          </div>

          <div className="panel p-5 text-sm text-muted-foreground">
            <div className="mb-2 font-mono text-xs uppercase tracking-wider">Legend</div>
            {sol.type === "maze" && (
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-secondary/50" /> explored</li>
                <li className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-primary" /> final path</li>
                <li className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-[hsl(var(--tile-goal))]" /> start</li>
                <li className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-accent" /> goal</li>
              </ul>
            )}
            {sol.type === "8puzzle" && <p className="text-xs">Highlighted tile = the one moved into the blank this step.</p>}
            {sol.type === "sudoku" && (
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-primary/40 ring-1 ring-primary" /> placement</li>
                <li className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-destructive/40 ring-1 ring-destructive" /> backtrack</li>
              </ul>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Visualize;
