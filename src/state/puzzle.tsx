import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import type { Board } from "@/backend/ai/eightPuzzle";
import type { Sudoku } from "@/backend/ai/sudoku";
import type { MazeData } from "@/backend/ai/maze";

export type PuzzleType = "8puzzle" | "sudoku" | "maze";
export type Difficulty = "easy" | "medium" | "hard";

interface PuzzleState {
  type: PuzzleType;
  difficulty: Difficulty;
  eight?: Board;
  sudoku?: { puzzle: Sudoku; solution: Sudoku };
  maze?: MazeData;
}

interface Ctx {
  state: PuzzleState;
  setState: (s: Partial<PuzzleState>) => void;
}

const PuzzleCtx = createContext<Ctx | null>(null);

export const PuzzleProvider = ({ children }: { children: ReactNode }) => {
  const [state, setS] = useState<PuzzleState>({ type: "8puzzle", difficulty: "medium" });
  const value = useMemo<Ctx>(() => ({ state, setState: (p) => setS((s) => ({ ...s, ...p })) }), [state]);
  return <PuzzleCtx.Provider value={value}>{children}</PuzzleCtx.Provider>;
};

export const usePuzzle = () => {
  const c = useContext(PuzzleCtx); if (!c) throw new Error("PuzzleProvider missing"); return c;
};
