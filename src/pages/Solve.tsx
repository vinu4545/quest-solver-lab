import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePuzzle } from "@/state/puzzle";
import { Algorithm, useSolution } from "@/state/solution";
import { solveBFS as eBFS, solveDFS as eDFS, solveAStar as eAStar } from "@/ai/eightPuzzle";
import { solveBacktracking } from "@/ai/sudoku";
import { solveBFS as mBFS, solveDFS as mDFS, solveAStar as mAStar } from "@/ai/maze";
import { EightPuzzleBoard } from "@/components/boards/EightPuzzleBoard";
import { SudokuBoard } from "@/components/boards/SudokuBoard";
import { MazeBoard } from "@/components/boards/MazeBoard";
import { ArrowRight, Cpu, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ALGOS_BY_TYPE: Record<string, Algorithm[]> = {
  "8puzzle": ["BFS", "DFS", "A*"],
  sudoku: ["Backtracking"],
  maze: ["BFS", "DFS", "A*"],
};

const Solve = () => {
  const { state } = usePuzzle();
  const { setSol } = useSolution();
  const navigate = useNavigate();
  const algos = ALGOS_BY_TYPE[state.type];
  const [algo, setAlgo] = useState<Algorithm>(algos[0]);
  const [busy, setBusy] = useState(false);

  const ready =
    (state.type === "8puzzle" && !!state.eight) ||
    (state.type === "sudoku" && !!state.sudoku) ||
    (state.type === "maze" && !!state.maze);

  const run = async () => {
    if (!ready) { toast({ title: "Generate a puzzle first" }); return; }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 30));
    try {
      if (state.type === "8puzzle" && state.eight) {
        const fn = algo === "BFS" ? eBFS : algo === "DFS" ? eDFS : eAStar;
        const r = fn(state.eight);
        if (!r.stats.found) toast({ title: "No solution within search limits", description: "Try A* or regenerate easier." });
        setSol({ type: "8puzzle", algorithm: algo, stats: r.stats, eightSteps: r.steps });
      } else if (state.type === "sudoku" && state.sudoku) {
        const r = solveBacktracking(state.sudoku.puzzle);
        setSol({ type: "sudoku", algorithm: "Backtracking", stats: r.stats, sudokuPuzzle: state.sudoku.puzzle, sudokuSolution: r.solution, sudokuSteps: r.steps });
      } else if (state.type === "maze" && state.maze) {
        const fn = algo === "BFS" ? mBFS : algo === "DFS" ? mDFS : mAStar;
        const r = fn(state.maze);
        setSol({ type: "maze", algorithm: algo, stats: r.stats, maze: state.maze, mazeOrder: r.order, mazePath: r.path });
      }
      navigate("/visualize");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container py-10">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Step 02</p>
        <h1 className="text-3xl font-bold md:text-4xl">Choose an algorithm</h1>
        <p className="mt-2 text-muted-foreground">The current puzzle from the generator will be solved with your chosen algorithm.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="panel grid place-items-center p-8 min-h-[420px]">
          {!ready && (
            <div className="text-center">
              <p className="text-muted-foreground">No puzzle yet.</p>
              <Button asChild className="mt-3"><Link to="/generate">Generate one</Link></Button>
            </div>
          )}
          {state.type === "8puzzle" && state.eight && <div className="w-[300px]"><EightPuzzleBoard board={state.eight} /></div>}
          {state.type === "sudoku" && state.sudoku && <SudokuBoard puzzle={state.sudoku.puzzle} />}
          {state.type === "maze" && state.maze && <MazeBoard maze={state.maze} />}
        </section>

        <aside className="panel space-y-6 p-5">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Algorithm</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {algos.map((a) => (
                <button key={a} onClick={() => setAlgo(a)}
                  className={`rounded-md border px-3 py-2 text-sm transition ${algo === a ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="font-mono text-foreground">{algo} — quick brief</div>
              <p className="mt-1">
                {algo === "BFS" && "Explores level by level. Optimal in steps for unweighted graphs."}
                {algo === "DFS" && "Dives deep first. Memory-light, not optimal."}
                {algo === "A*" && "f(n) = g(n) + h(n). Manhattan-distance heuristic guides toward goal."}
                {algo === "Backtracking" && "Constraint propagation with MRV variable ordering."}
              </p>
            </div>
          </div>

          <Button onClick={run} disabled={!ready || busy} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
            Solve
          </Button>
        </aside>
      </div>
    </main>
  );
};

export default Solve;
