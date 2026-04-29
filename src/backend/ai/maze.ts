import { MinHeap, SolveStats } from "./common";

export type Cell = 0 | 1; // 0 path, 1 wall
export type Maze = Cell[][];
export type Pos = { r: number; c: number };

export interface MazeData { grid: Maze; start: Pos; end: Pos; rows: number; cols: number }

// DFS recursive backtracker generation (perfect maze, always solvable)
export const generateMaze = (difficulty: "easy" | "medium" | "hard"): MazeData => {
  const size = difficulty === "easy" ? 11 : difficulty === "medium" ? 19 : 27; // odd sizes
  const rows = size, cols = size;
  const g: Maze = Array.from({ length: rows }, () => Array(cols).fill(1) as Cell[]);
  const stack: Pos[] = [{ r: 1, c: 1 }];
  g[1][1] = 0;
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const dirs = [[-2,0],[2,0],[0,-2],[0,2]].sort(() => Math.random() - 0.5);
    let carved = false;
    for (const [dr, dc] of dirs) {
      const nr = cur.r + dr, nc = cur.c + dc;
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && g[nr][nc] === 1) {
        g[cur.r + dr / 2][cur.c + dc / 2] = 0;
        g[nr][nc] = 0;
        stack.push({ r: nr, c: nc }); carved = true; break;
      }
    }
    if (!carved) stack.pop();
  }
  return { grid: g, start: { r: 1, c: 1 }, end: { r: rows - 2, c: cols - 2 }, rows, cols };
};

const key = (p: Pos) => `${p.r},${p.c}`;
const neighbors = (g: Maze, p: Pos): Pos[] => {
  const out: Pos[] = [];
  for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    const nr = p.r + dr, nc = p.c + dc;
    if (nr >= 0 && nr < g.length && nc >= 0 && nc < g[0].length && g[nr][nc] === 0) out.push({ r: nr, c: nc });
  }
  return out;
};

export interface MazeStep { explored: Pos[]; path: Pos[] }

export interface MazeSolveResult { order: Pos[]; path: Pos[]; stats: SolveStats }

export const solveBFS = (m: MazeData): MazeSolveResult => {
  const t0 = performance.now();
  const parent = new Map<string, string>();
  const visited = new Set<string>([key(m.start)]);
  const order: Pos[] = [];
  const queue: Pos[] = [m.start]; let head = 0; let found = false;
  while (head < queue.length) {
    const cur = queue[head++]; order.push(cur);
    if (cur.r === m.end.r && cur.c === m.end.c) { found = true; break; }
    for (const n of neighbors(m.grid, cur)) {
      const k = key(n); if (!visited.has(k)) { visited.add(k); parent.set(k, key(cur)); queue.push(n); }
    }
  }
  const path = reconstructPath(m.start, m.end, parent, found);
  return { order, path, stats: { algorithm: "BFS", steps: Math.max(0, path.length - 1), nodesExplored: order.length, timeMs: +(performance.now() - t0).toFixed(2), found } };
};

export const solveDFS = (m: MazeData): MazeSolveResult => {
  const t0 = performance.now();
  const parent = new Map<string, string>();
  const visited = new Set<string>([key(m.start)]);
  const order: Pos[] = [];
  const stack: Pos[] = [m.start]; let found = false;
  while (stack.length) {
    const cur = stack.pop()!; order.push(cur);
    if (cur.r === m.end.r && cur.c === m.end.c) { found = true; break; }
    for (const n of neighbors(m.grid, cur)) {
      const k = key(n); if (!visited.has(k)) { visited.add(k); parent.set(k, key(cur)); stack.push(n); }
    }
  }
  const path = reconstructPath(m.start, m.end, parent, found);
  return { order, path, stats: { algorithm: "DFS", steps: Math.max(0, path.length - 1), nodesExplored: order.length, timeMs: +(performance.now() - t0).toFixed(2), found } };
};

export const solveAStar = (m: MazeData): MazeSolveResult => {
  const t0 = performance.now();
  const h = (p: Pos) => Math.abs(p.r - m.end.r) + Math.abs(p.c - m.end.c);
  const heap = new MinHeap<Pos>();
  const g = new Map<string, number>([[key(m.start), 0]]);
  const parent = new Map<string, string>();
  const closed = new Set<string>();
  const order: Pos[] = [];
  heap.push(h(m.start), m.start);
  let found = false;
  while (heap.size()) {
    const cur = heap.pop()!; const ck = key(cur);
    if (closed.has(ck)) continue; closed.add(ck); order.push(cur);
    if (cur.r === m.end.r && cur.c === m.end.c) { found = true; break; }
    for (const n of neighbors(m.grid, cur)) {
      const k = key(n); const t = (g.get(ck) ?? 0) + 1;
      if (t < (g.get(k) ?? Infinity)) { g.set(k, t); parent.set(k, ck); heap.push(t + h(n), n); }
    }
  }
  const path = reconstructPath(m.start, m.end, parent, found);
  return { order, path, stats: { algorithm: "A*", steps: Math.max(0, path.length - 1), nodesExplored: order.length, timeMs: +(performance.now() - t0).toFixed(2), found } };
};

const reconstructPath = (start: Pos, end: Pos, parent: Map<string, string>, found: boolean): Pos[] => {
  if (!found) return [];
  const path: Pos[] = [];
  let k: string | undefined = key(end);
  while (k) {
    const [r, c] = k.split(",").map(Number); path.push({ r, c });
    if (k === key(start)) break;
    k = parent.get(k);
  }
  return path.reverse();
};
