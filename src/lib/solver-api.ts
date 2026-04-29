const API_BASE = import.meta.env.VITE_SOLVER_API_URL ?? "http://127.0.0.1:8000";

type PuzzleType = "8puzzle" | "sudoku" | "maze";
type Difficulty = "easy" | "medium" | "hard";
type Algorithm = "BFS" | "DFS" | "A*" | "Backtracking";

type Board = number[];
type Sudoku = number[][];
type Pos = { r: number; c: number };

type MazeData = {
  grid: number[][];
  start: Pos;
  end: Pos;
  rows: number;
  cols: number;
};

type SolveStats = {
  algorithm: string;
  steps: number;
  nodesExplored: number;
  timeMs: number;
  found: boolean;
};

function normalizeStats(stats: Record<string, unknown>): SolveStats {
  return {
    algorithm: String(stats.algorithm ?? ""),
    steps: Number(stats.steps ?? 0),
    nodesExplored: Number(stats.nodesExplored ?? stats.nodes_explored ?? 0),
    timeMs: Number(stats.timeMs ?? stats.time_ms ?? 0),
    found: Boolean(stats.found),
  };
}

type EightPuzzleResponse = { eight: Board };
type SudokuResponse = { sudoku: { puzzle: Sudoku; solution: Sudoku } };
type MazeResponse = { maze: MazeData };

type GenerateResponse = EightPuzzleResponse | SudokuResponse | MazeResponse;

type EightSolveResponse = {
  type: "8puzzle";
  algorithm: Algorithm;
  stats: SolveStats;
  eightSteps: { board: Board; move: string }[];
};

type SudokuSolveResponse = {
  type: "sudoku";
  algorithm: Algorithm;
  stats: SolveStats;
  sudokuPuzzle: Sudoku;
  sudokuSolution: Sudoku;
  sudokuSteps: { r: number; c: number; v: number; action: "place" | "backtrack" }[];
};

type MazeSolveResponse = {
  type: "maze";
  algorithm: Algorithm;
  stats: SolveStats;
  maze: MazeData;
  mazeOrder: Pos[];
  mazePath: Pos[];
};

type SolveResponse = EightSolveResponse | SudokuSolveResponse | MazeSolveResponse;

async function requestJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function generatePuzzle(type: PuzzleType, difficulty: Difficulty) {
  const data = await requestJson<GenerateResponse>("/api/generate", { type, difficulty });
  if (type === "8puzzle") return { eight: (data as EightPuzzleResponse).eight };
  if (type === "sudoku") return { sudoku: (data as SudokuResponse).sudoku };
  return { maze: (data as MazeResponse).maze };
}

export async function solvePuzzle(input:
  | { type: "8puzzle"; algorithm: Exclude<Algorithm, "Backtracking">; board: Board }
  | { type: "sudoku"; puzzle: Sudoku }
  | { type: "maze"; algorithm: Exclude<Algorithm, "Backtracking">; maze: MazeData }
) {
  const data = await requestJson<SolveResponse>("/api/solve", input);

  return {
    ...data,
    stats: normalizeStats(data.stats as Record<string, unknown>),
  };
}
