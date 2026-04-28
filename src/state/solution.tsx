import { createContext, ReactNode, useContext, useState } from "react";
import type { Board } from "@/ai/eightPuzzle";
import type { Sudoku, SudokuStep } from "@/ai/sudoku";
import type { MazeData, Pos } from "@/ai/maze";
import type { SolveStats } from "@/ai/common";

export type Algorithm = "BFS" | "DFS" | "A*" | "Backtracking";

export interface SolutionPayload {
  type: "8puzzle" | "sudoku" | "maze";
  algorithm: Algorithm;
  stats: SolveStats;
  // 8-puzzle
  eightSteps?: { board: Board; move: string }[];
  // sudoku
  sudokuPuzzle?: Sudoku;
  sudokuSolution?: Sudoku;
  sudokuSteps?: SudokuStep[];
  // maze
  maze?: MazeData;
  mazeOrder?: Pos[];
  mazePath?: Pos[];
}

const C = createContext<{ sol: SolutionPayload | null; setSol: (s: SolutionPayload | null) => void } | null>(null);

export const SolutionProvider = ({ children }: { children: ReactNode }) => {
  const [sol, setSol] = useState<SolutionPayload | null>(null);
  return <C.Provider value={{ sol, setSol }}>{children}</C.Provider>;
};

export const useSolution = () => {
  const c = useContext(C); if (!c) throw new Error("SolutionProvider missing"); return c;
};
