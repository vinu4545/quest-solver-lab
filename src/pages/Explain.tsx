import { Link } from "react-router-dom";
import { useSolution } from "@/state/solution";
import { Button } from "@/components/ui/button";

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="panel p-5">
    <h3 className="mb-2 font-mono text-sm font-bold text-primary">{title}</h3>
    <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
  </div>
);

const Explain = () => {
  const { sol } = useSolution();

  return (
    <main className="container py-10">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Reasoning · Explainability</p>
        <h1 className="text-3xl font-bold md:text-4xl">Why this solution works</h1>
      </div>

      {!sol ? (
        <div className="panel p-8 text-center">
          <p className="text-muted-foreground">Solve a puzzle to see the AI's reasoning.</p>
          <Button asChild className="mt-3"><Link to="/solve">Go to solver</Link></Button>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <Block title="Algorithm used">
            <p><span className="font-mono text-foreground">{sol.algorithm}</span> on the {sol.type === "8puzzle" ? "8-Puzzle state graph" : sol.type === "sudoku" ? "Sudoku constraint network" : "maze grid graph"}.</p>
          </Block>

          <Block title="Knowledge representation">
            {sol.type === "8puzzle" && <p>The state is a 9-element array (row-major). The goal predicate is exact array equality with [1..8,0]. Transitions = swap blank with an orthogonal neighbor.</p>}
            {sol.type === "sudoku" && <p>The state is a 9×9 integer grid with 0 marking unknowns. Constraints: every row, column, and 3×3 box contains 1–9 exactly once.</p>}
            {sol.type === "maze" && <p>The grid is an undirected graph: each open cell is a node, edges connect 4-adjacent open cells. Start and goal are fixed corners.</p>}
          </Block>

          <Block title="Heuristic / strategy">
            {sol.algorithm === "A*" && <p>f(n) = g(n) + h(n). For the 8-puzzle, h is the sum of Manhattan distances from each tile to its goal — admissible and consistent, so A* returns an optimal solution. For the maze, h is Manhattan distance to the goal cell.</p>}
            {sol.algorithm === "BFS" && <p>BFS expands nodes in FIFO order. Because all edges cost 1, the first time the goal is dequeued, the path is guaranteed to have the minimum number of steps.</p>}
            {sol.algorithm === "DFS" && <p>DFS expands deeply via a LIFO stack. It finds *a* path quickly with low memory but does not guarantee the shortest one — useful as a baseline.</p>}
            {sol.algorithm === "Backtracking" && <p>Constraint-satisfaction search: pick the empty cell with the fewest legal values (MRV heuristic), try each value, and recurse. On contradiction, undo and try the next.</p>}
          </Block>

          <Block title="Complexity">
            {sol.algorithm === "BFS" && <p>Time/Space O(b^d) where b ≈ 2.13 for the 8-puzzle and d is the optimal solution depth. For mazes, O(V + E).</p>}
            {sol.algorithm === "DFS" && <p>Time O(b^m) where m is the max search depth; space O(bm). Not optimal.</p>}
            {sol.algorithm === "A*" && <p>Worst-case O(b^d) but with a good admissible heuristic the effective branching factor drops sharply, often expanding orders of magnitude fewer nodes than BFS.</p>}
            {sol.algorithm === "Backtracking" && <p>Worst-case exponential in the number of empty cells, but MRV plus constraint checking keeps real-world Sudoku solving in milliseconds.</p>}
          </Block>

          <div className="lg:col-span-2 panel p-5">
            <h3 className="mb-3 font-mono text-sm font-bold text-primary">This run</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["Solution length", sol.stats.steps],
                ["Nodes explored", sol.stats.nodesExplored.toLocaleString()],
                ["Time", `${sol.stats.timeMs} ms`],
                ["Found", sol.stats.found ? "Yes" : "No"],
              ].map(([k, v]) => (
                <div key={k as string} className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                  <div className="mt-0.5 font-mono text-lg font-bold">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Explain;
