import { MinHeap, SolveStats } from "./common";

// 8-Puzzle: 3x3 board with values 0..8 (0 = blank). Goal: [1,2,3,4,5,6,7,8,0].
export type Board = number[]; // length 9
export const GOAL: Board = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export const key = (b: Board) => b.join(",");

const swap = (b: Board, i: number, j: number): Board => {
  const c = b.slice(); [c[i], c[j]] = [c[j], c[i]]; return c;
};

export const neighbors = (b: Board): { board: Board; move: string }[] => {
  const z = b.indexOf(0);
  const r = Math.floor(z / 3), c = z % 3;
  const out: { board: Board; move: string }[] = [];
  if (r > 0) out.push({ board: swap(b, z, z - 3), move: "Up" });
  if (r < 2) out.push({ board: swap(b, z, z + 3), move: "Down" });
  if (c > 0) out.push({ board: swap(b, z, z - 1), move: "Left" });
  if (c < 2) out.push({ board: swap(b, z, z + 1), move: "Right" });
  return out;
};

// Solvability: count inversions (excluding 0). 3x3 solvable iff inversions even.
export const isSolvable = (b: Board) => {
  const a = b.filter((x) => x !== 0);
  let inv = 0;
  for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] > a[j]) inv++;
  return inv % 2 === 0;
};

export const isGoal = (b: Board) => b.every((v, i) => v === GOAL[i]);

// Manhattan distance heuristic
export const manhattan = (b: Board) => {
  let d = 0;
  for (let i = 0; i < 9; i++) {
    const v = b[i]; if (v === 0) continue;
    const gi = v - 1;
    d += Math.abs(Math.floor(i / 3) - Math.floor(gi / 3)) + Math.abs((i % 3) - (gi % 3));
  }
  return d;
};

export interface PuzzleStep { board: Board; move: string }

// Generate by walking backwards from goal `depth` random moves — guarantees solvable & non-trivial.
export const generate8Puzzle = (difficulty: "easy" | "medium" | "hard"): Board => {
  const depth = difficulty === "easy" ? 12 : difficulty === "medium" ? 28 : 60;
  let b = GOAL.slice();
  let prevZ = -1;
  for (let i = 0; i < depth; i++) {
    const opts = neighbors(b).filter((n) => n.board.indexOf(0) !== prevZ);
    const choice = opts[Math.floor(Math.random() * opts.length)];
    prevZ = b.indexOf(0);
    b = choice.board;
  }
  if (isGoal(b)) return generate8Puzzle(difficulty);
  return b;
};

interface SolveResult { steps: PuzzleStep[]; stats: SolveStats }

const NODE_LIMIT = 200_000;

export const solveBFS = (start: Board): SolveResult => {
  const t0 = performance.now();
  const visited = new Set<string>([key(start)]);
  const parent = new Map<string, { p: string; move: string }>();
  const queue: Board[] = [start]; let head = 0; let explored = 0;
  let goalKey: string | null = null;
  while (head < queue.length && explored < NODE_LIMIT) {
    const cur = queue[head++]; explored++;
    if (isGoal(cur)) { goalKey = key(cur); break; }
    for (const n of neighbors(cur)) {
      const k = key(n.board);
      if (!visited.has(k)) { visited.add(k); parent.set(k, { p: key(cur), move: n.move }); queue.push(n.board); }
    }
  }
  return reconstruct(start, goalKey, parent, "BFS", explored, t0);
};

export const solveDFS = (start: Board, maxDepth = 30): SolveResult => {
  const t0 = performance.now();
  const visited = new Map<string, number>();
  const parent = new Map<string, { p: string; move: string }>();
  const stack: { b: Board; d: number }[] = [{ b: start, d: 0 }];
  visited.set(key(start), 0);
  let explored = 0; let goalKey: string | null = null;
  while (stack.length && explored < NODE_LIMIT) {
    const { b, d } = stack.pop()!; explored++;
    if (isGoal(b)) { goalKey = key(b); break; }
    if (d >= maxDepth) continue;
    for (const n of neighbors(b)) {
      const k = key(n.board); const prev = visited.get(k);
      if (prev === undefined || prev > d + 1) {
        visited.set(k, d + 1); parent.set(k, { p: key(b), move: n.move });
        stack.push({ b: n.board, d: d + 1 });
      }
    }
  }
  return reconstruct(start, goalKey, parent, "DFS", explored, t0);
};

export const solveAStar = (start: Board): SolveResult => {
  const t0 = performance.now();
  const heap = new MinHeap<{ b: Board; g: number }>();
  const gScore = new Map<string, number>();
  const parent = new Map<string, { p: string; move: string }>();
  gScore.set(key(start), 0);
  heap.push(manhattan(start), { b: start, g: 0 });
  let explored = 0; let goalKey: string | null = null;
  const closed = new Set<string>();
  while (heap.size() && explored < NODE_LIMIT) {
    const cur = heap.pop()!; const ck = key(cur.b);
    if (closed.has(ck)) continue; closed.add(ck); explored++;
    if (isGoal(cur.b)) { goalKey = ck; break; }
    for (const n of neighbors(cur.b)) {
      const k = key(n.board); const tentative = cur.g + 1;
      if (tentative < (gScore.get(k) ?? Infinity)) {
        gScore.set(k, tentative); parent.set(k, { p: ck, move: n.move });
        heap.push(tentative + manhattan(n.board), { b: n.board, g: tentative });
      }
    }
  }
  return reconstruct(start, goalKey, parent, "A*", explored, t0);
};

const reconstruct = (
  start: Board, goalKey: string | null,
  parent: Map<string, { p: string; move: string }>,
  algo: string, explored: number, t0: number
): SolveResult => {
  const found = !!goalKey;
  const path: PuzzleStep[] = [];
  if (found) {
    const boards = new Map<string, Board>();
    // Rebuild boards by re-walking via parent moves from start
    let k = goalKey!; const trail: string[] = [k];
    while (parent.has(k)) { const p = parent.get(k)!; trail.push(p.p); k = p.p; }
    trail.reverse();
    // Reconstruct boards along trail
    let cur = start; boards.set(key(start), start);
    for (let i = 1; i < trail.length; i++) {
      const tk = trail[i];
      // Find neighbor of cur with matching key
      const next = neighbors(cur).find((n) => key(n.board) === tk)!;
      cur = next.board; boards.set(tk, cur);
    }
    // Build steps
    let prev: string | null = null;
    for (const tk of trail) {
      const move = prev ? parent.get(tk)?.move ?? "" : "Start";
      path.push({ board: boards.get(tk)!, move });
      prev = tk;
    }
  }
  return {
    steps: path,
    stats: { algorithm: algo, steps: Math.max(0, path.length - 1), nodesExplored: explored, timeMs: +(performance.now() - t0).toFixed(2), found },
  };
};
