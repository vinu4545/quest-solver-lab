"""Sudoku solver algorithm (Backtracking with MRV heuristic)."""

import random
import time
from typing import List, Tuple, Deque
from collections import deque
from dataclasses import dataclass
from copy import deepcopy

from .common import SolveStats

Sudoku = List[List[int]]  # 9x9 grid, 0 = empty


@dataclass
class SudokuStep:
    """Single step in sudoku solving."""

    r: int
    c: int
    v: int
    action: str  # "place" or "backtrack"


@dataclass
class SudokuSolveResult:
    """Result of sudoku solving."""

    solution: Sudoku
    steps: List[SudokuStep]
    stats: SolveStats


def clone_grid(grid: Sudoku) -> Sudoku:
    """Deep copy sudoku grid."""
    return deepcopy(grid)


def is_valid(grid: Sudoku, r: int, c: int, v: int) -> bool:
    """Check if placing value v at (r, c) is valid."""
    # Check row
    if v in grid[r]:
        return False

    # Check column
    if v in [grid[i][c] for i in range(9)]:
        return False

    # Check 3x3 box
    box_r, box_c = (r // 3) * 3, (c // 3) * 3
    for i in range(box_r, box_r + 3):
        for j in range(box_c, box_c + 3):
            if grid[i][j] == v:
                return False

    return True


def get_valid_values(grid: Sudoku, r: int, c: int) -> List[int]:
    """Get list of valid values for cell (r, c)."""
    if grid[r][c] != 0:
        return []

    valid = []
    for v in range(1, 10):
        if is_valid(grid, r, c, v):
            valid.append(v)

    return valid


def fill_solved(grid: Sudoku) -> bool:
    """Fill sudoku grid with random valid values."""
    for r in range(9):
        for c in range(9):
            if grid[r][c] == 0:
                values = list(range(1, 10))
                random.shuffle(values)

                for v in values:
                    if is_valid(grid, r, c, v):
                        grid[r][c] = v
                        if fill_solved(grid):
                            return True
                        grid[r][c] = 0

                return False

    return True


def generate_sudoku(difficulty: str) -> Tuple[Sudoku, Sudoku]:
    """Generate sudoku puzzle."""
    remove_count_map = {"easy": 35, "medium": 48, "hard": 56}
    remove_count = remove_count_map.get(difficulty, 48)

    # Generate complete solution
    grid: Sudoku = [[0 for _ in range(9)] for _ in range(9)]
    fill_solved(grid)

    solution = clone_grid(grid)

    # Create puzzle by removing cells
    cells = list(range(81))
    random.shuffle(cells)

    removed = 0
    for idx in cells:
        if removed >= remove_count:
            break

        r, c = idx // 9, idx % 9

        if grid[r][c] == 0:
            continue

        grid[r][c] = 0
        removed += 1

    return grid, solution


def solve_backtracking(
    puzzle: Sudoku, record_steps: bool = True
) -> SudokuSolveResult:
    """Solve sudoku using backtracking with MRV heuristic."""
    start_time = time.time()
    grid = clone_grid(puzzle)
    steps: List[SudokuStep] = []
    explored = 0
    step_limit = 5000

    def recurse() -> bool:
        nonlocal explored

        # MRV (Minimum Remaining Values) heuristic - pick cell with fewest options
        best_r, best_c = -1, -1
        best_opts = 10
        best_list = []

        for r in range(9):
            for c in range(9):
                if grid[r][c] == 0:
                    opts = get_valid_values(grid, r, c)
                    if len(opts) < best_opts:
                        best_opts = len(opts)
                        best_r, best_c = r, c
                        best_list = opts
                        if best_opts <= 1:
                            break

            if best_opts <= 1:
                break

        if best_r == -1:
            return True  # All cells filled

        for v in best_list:
            grid[best_r][best_c] = v
            explored += 1

            if record_steps and len(steps) < step_limit:
                steps.append(SudokuStep(r=best_r, c=best_c, v=v, action="place"))

            if recurse():
                return True

            grid[best_r][best_c] = 0

            if record_steps and len(steps) < step_limit:
                steps.append(
                    SudokuStep(r=best_r, c=best_c, v=0, action="backtrack")
                )

        return False

    found = recurse()
    elapsed = (time.time() - start_time) * 1000

    stats = SolveStats(
        algorithm="Backtracking + MRV",
        steps=len(steps),
        nodes_explored=explored,
        time_ms=elapsed,
        found=found,
    )

    return SudokuSolveResult(solution=grid, steps=steps, stats=stats)


def solve_bfs(puzzle: Sudoku, record_steps: bool = True) -> SudokuSolveResult:
    """Solve sudoku using BFS."""
    start_time = time.time()
    initial = clone_grid(puzzle)
    queue: Deque[Tuple[Sudoku, List[SudokuStep]]] = deque([(initial, [])])
    visited = set()
    explored = 0
    step_limit = 5000
    max_states = 50000  # Limit explored states to avoid timeout

    def grid_key(g: Sudoku) -> str:
        """Convert grid to hashable key."""
        return "".join(str(v) for row in g for v in row)

    while queue and explored < max_states:
        grid, steps = queue.popleft()
        key = grid_key(grid)

        if key in visited:
            continue

        visited.add(key)
        explored += 1

        # Find first empty cell
        found_empty = False
        for r in range(9):
            for c in range(9):
                if grid[r][c] == 0:
                    found_empty = True
                    # Try each valid value
                    for v in range(1, 10):
                        if is_valid(grid, r, c, v):
                            new_grid = clone_grid(grid)
                            new_grid[r][c] = v
                            new_steps = steps.copy()
                            if record_steps and len(new_steps) < step_limit:
                                new_steps.append(
                                    SudokuStep(r=r, c=c, v=v, action="place")
                                )
                            queue.append((new_grid, new_steps))
                    break
            if found_empty:
                break

        # If no empty cell found, grid is solved
        if not found_empty:
            elapsed = (time.time() - start_time) * 1000
            stats = SolveStats(
                algorithm="BFS",
                steps=len(steps),
                nodes_explored=explored,
                time_ms=elapsed,
                found=True,
            )
            return SudokuSolveResult(solution=grid, steps=steps, stats=stats)

    elapsed = (time.time() - start_time) * 1000
    stats = SolveStats(
        algorithm="BFS",
        steps=0,
        nodes_explored=explored,
        time_ms=elapsed,
        found=False,
    )
    return SudokuSolveResult(solution=puzzle, steps=[], stats=stats)


def solve_dfs(puzzle: Sudoku, record_steps: bool = True) -> SudokuSolveResult:
    """Solve sudoku using DFS."""
    start_time = time.time()
    grid = clone_grid(puzzle)
    steps: List[SudokuStep] = []
    explored = 0
    step_limit = 5000
    max_depth = 5000

    def dfs(depth: int) -> bool:
        nonlocal explored

        if depth > max_depth:
            return False

        explored += 1

        # Find first empty cell
        for r in range(9):
            for c in range(9):
                if grid[r][c] == 0:
                    # Try each valid value
                    for v in range(1, 10):
                        if is_valid(grid, r, c, v):
                            grid[r][c] = v
                            if record_steps and len(steps) < step_limit:
                                steps.append(
                                    SudokuStep(r=r, c=c, v=v, action="place")
                                )

                            if dfs(depth + 1):
                                return True

                            grid[r][c] = 0
                            if record_steps and len(steps) < step_limit:
                                steps.append(
                                    SudokuStep(r=r, c=c, v=0, action="backtrack")
                                )

                    return False

        # All cells filled = solved
        return True

    found = dfs(0)
    elapsed = (time.time() - start_time) * 1000

    stats = SolveStats(
        algorithm="DFS",
        steps=len(steps),
        nodes_explored=explored,
        time_ms=elapsed,
        found=found,
    )

    return SudokuSolveResult(solution=grid, steps=steps, stats=stats)
