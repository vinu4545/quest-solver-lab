import { SolveStats } from "./common";

export type Sudoku = number[][]; // 9x9, 0 = empty
export type Cell = { r: number; c: number; v: number };

export const cloneGrid = (g: Sudoku): Sudoku => g.map((r) => r.slice());

export const isValid = (g: Sudoku, r: number, c: number, v: number) => {
  for (let i = 0; i < 9; i++) if (g[r][i] === v || g[i][c] === v) return false;
  const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (g[br + i][bc + j] === v) return false;
  return true;
};

const shuffled = <T,>(a: T[]) => { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };

const fillSolved = (g: Sudoku): boolean => {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (g[r][c] === 0) {
    for (const v of shuffled([1,2,3,4,5,6,7,8,9])) {
      if (isValid(g, r, c, v)) { g[r][c] = v; if (fillSolved(g)) return true; g[r][c] = 0; }
    }
    return false;
  }
  return true;
};

export const generateSudoku = (difficulty: "easy" | "medium" | "hard"): { puzzle: Sudoku; solution: Sudoku } => {
  const g: Sudoku = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillSolved(g);
  const solution = cloneGrid(g);
  const removeCount = difficulty === "easy" ? 35 : difficulty === "medium" ? 48 : 56;
  const cells = shuffled(Array.from({ length: 81 }, (_, i) => i));
  let removed = 0;
  for (const idx of cells) {
    if (removed >= removeCount) break;
    const r = Math.floor(idx / 9), c = idx % 9;
    if (g[r][c] === 0) continue;
    g[r][c] = 0; removed++;
  }
  return { puzzle: g, solution };
};

export interface SudokuStep { r: number; c: number; v: number; action: "place" | "backtrack" }

export const solveBacktracking = (puzzle: Sudoku, recordSteps = true) => {
  const t0 = performance.now();
  const g = cloneGrid(puzzle);
  const steps: SudokuStep[] = [];
  let explored = 0;
  const STEP_LIMIT = 5000;
  const recur = (): boolean => {
    // Find empty cell with MRV heuristic for speed
    let br = -1, bc = -1, bestOpts = 10, bestList: number[] = [];
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (g[r][c] === 0) {
      const opts: number[] = [];
      for (let v = 1; v <= 9; v++) if (isValid(g, r, c, v)) opts.push(v);
      if (opts.length < bestOpts) { bestOpts = opts.length; br = r; bc = c; bestList = opts; if (bestOpts <= 1) break; }
    }
    if (br === -1) return true;
    for (const v of bestList) {
      g[br][bc] = v; explored++;
      if (recordSteps && steps.length < STEP_LIMIT) steps.push({ r: br, c: bc, v, action: "place" });
      if (recur()) return true;
      g[br][bc] = 0;
      if (recordSteps && steps.length < STEP_LIMIT) steps.push({ r: br, c: bc, v: 0, action: "backtrack" });
    }
    return false;
  };
  const found = recur();
  const stats: SolveStats = { algorithm: "Backtracking + MRV", steps: steps.length, nodesExplored: explored, timeMs: +(performance.now() - t0).toFixed(2), found };
  return { solution: g, steps, stats };
};
