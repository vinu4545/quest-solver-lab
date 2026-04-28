import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Compass, Sparkles, Workflow, Layers, GitBranch, Zap, ArrowRight } from "lucide-react";

const Feature = ({ icon: Icon, title, body, gradient }: { icon: any; title: string; body: string; gradient: string }) => (
  <div className="panel panel-gradient group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
    <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${gradient} text-primary-foreground shadow-glow-primary`}>
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="mb-1.5 font-mono text-base font-bold">{title}</h3>
    <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
  </div>
);

const Home = () => {
  return (
    <main className="container relative py-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-hero p-10 md:p-16">
        {/* animated blobs */}
        <div className="blob h-72 w-72 bg-primary/40 -top-16 -left-10 animate-float-blob" />
        <div className="blob h-80 w-80 bg-accent/40 top-10 right-0 animate-float-blob" style={{ animationDelay: "-5s" }} />
        <div className="blob h-64 w-64 bg-secondary/40 bottom-0 left-1/3 animate-float-blob" style={{ animationDelay: "-9s" }} />
        <div className="absolute inset-0 grid-pattern opacity-40" />

        <div className="relative">
          <div className="absolute right-0 top-0 chip">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" /> AI engine online
          </div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-primary backdrop-blur">
            <Zap className="h-3 w-3" /> Search · Knowledge · Planning
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] md:text-7xl">
            An <span className="text-gradient-rainbow">intelligent puzzle</span><br />
            generator <span className="text-gradient-sunset">&amp; solver</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Cogni generates valid, solvable puzzles and solves them with classical AI search —
            <span className="text-foreground"> BFS</span>,
            <span className="text-foreground"> DFS</span>,
            <span className="text-foreground"> A*</span>, and
            <span className="text-foreground"> constraint backtracking</span> — with full step-by-step reasoning.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="group bg-gradient-rainbow bg-[length:200%_200%] text-primary-foreground shadow-glow-primary transition-all hover:bg-[position:100%_50%] hover:shadow-glow-accent">
              <Link to="/generate"><Sparkles className="mr-2 h-4 w-4" /> Generate Puzzle <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/30 bg-background/40 backdrop-blur hover:bg-primary/10 hover:text-primary">
              <Link to="/solve"><Workflow className="mr-2 h-4 w-4" /> Solve Puzzle</Link>
            </Button>
          </div>

          {/* mini stats */}
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[
              { k: "Algorithms", v: "4+" },
              { k: "Puzzle types", v: "3" },
              { k: "Heuristics", v: "Admissible" },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-border/60 bg-background/40 p-3 backdrop-blur">
                <div className="font-mono text-xl font-bold text-gradient">{s.v}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-14 grid gap-5 md:grid-cols-3">
        <Feature icon={GitBranch} title="Search Algorithms" body="BFS for shortest path, DFS for depth, A* with admissible heuristics, and backtracking for constraint problems." gradient="bg-gradient-primary" />
        <Feature icon={Layers} title="Knowledge Representation" body="Puzzles modeled as state spaces with explicit transitions, goal predicates, and structured grids." gradient="bg-gradient-accent" />
        <Feature icon={Compass} title="Planning & Explainability" body="Solvers emit ordered action plans — move, fill, navigate — with visual playback and stats." gradient="bg-gradient-sunset" />
      </section>

      {/* Supported puzzles */}
      <section className="mt-14 panel panel-gradient relative overflow-hidden p-7">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="mb-5 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow-primary">
              <Brain className="h-4 w-4" />
            </span>
            <h2 className="font-mono text-base font-bold">Supported puzzles</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "8-Puzzle", tag: "Sliding · State search", algos: "BFS · DFS · A*", grad: "from-primary/20 to-secondary/20", accent: "text-primary" },
              { name: "Sudoku", tag: "Constraint satisfaction", algos: "Backtracking + MRV", grad: "from-secondary/20 to-accent/20", accent: "text-secondary" },
              { name: "Maze", tag: "Pathfinding", algos: "BFS · DFS · A*", grad: "from-accent/20 to-primary/20", accent: "text-accent" },
            ].map((p) => (
              <div key={p.name} className={`group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br ${p.grad} p-5 transition-all hover:-translate-y-1 hover:border-primary/40`}>
                <div className={`mb-1 font-mono text-xl font-bold ${p.accent}`}>{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.tag}</div>
                <div className="mt-4 chip border-primary/30 bg-background/50">{p.algos}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
