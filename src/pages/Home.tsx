import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Compass, Sparkles, Workflow, Layers, GitBranch } from "lucide-react";

const Feature = ({ icon: Icon, title, body }: { icon: any; title: string; body: string }) => (
  <div className="panel p-5">
    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-primary">
      <Icon className="h-4 w-4" />
    </div>
    <h3 className="mb-1 font-mono text-sm font-bold">{title}</h3>
    <p className="text-sm text-muted-foreground">{body}</p>
  </div>
);

const Home = () => {
  return (
    <main className="container py-14">
      <section className="bg-gradient-hero relative overflow-hidden rounded-2xl border border-border p-10 md:p-16">
        <div className="absolute right-8 top-8 chip">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" /> AI engine online
        </div>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Search · Knowledge · Planning</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl">
          An <span className="text-gradient">intelligent puzzle</span><br />generator and solver.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
          Cogni generates valid, solvable puzzles and solves them with classical AI search —
          BFS, DFS, A*, and constraint backtracking — with full step-by-step reasoning.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Link to="/generate"><Sparkles className="mr-2 h-4 w-4" /> Generate Puzzle</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/solve"><Workflow className="mr-2 h-4 w-4" /> Solve Puzzle</Link>
          </Button>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        <Feature icon={GitBranch} title="Search Algorithms" body="BFS for shortest path, DFS for depth, A* with admissible heuristics, and backtracking for constraint problems." />
        <Feature icon={Layers} title="Knowledge Representation" body="Puzzles modeled as state spaces with explicit transitions, goal predicates, and structured grids." />
        <Feature icon={Compass} title="Planning & Explainability" body="Solvers emit ordered action plans — move, fill, navigate — with visual playback and stats." />
      </section>

      <section className="mt-12 panel p-6">
        <div className="mb-4 flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <h2 className="font-mono text-sm font-bold">Supported puzzles</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: "8-Puzzle", tag: "Sliding · State search", algos: "BFS · DFS · A*" },
            { name: "Sudoku", tag: "Constraint satisfaction", algos: "Backtracking + MRV" },
            { name: "Maze", tag: "Pathfinding", algos: "BFS · DFS · A*" },
          ].map((p) => (
            <div key={p.name} className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="mb-1 font-mono text-base font-bold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.tag}</div>
              <div className="mt-3 chip">{p.algos}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
