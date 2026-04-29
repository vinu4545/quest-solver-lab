"""Quest Solver Lab - Python Solver Algorithms"""

from .common import MinHeap, SolveStats
from .eight_puzzle import (
    solve_bfs as eight_puzzle_bfs,
    solve_dfs as eight_puzzle_dfs,
    solve_astar as eight_puzzle_astar,
    generate_puzzle,
    is_solvable,
)
from .maze import (
    solve_bfs as maze_bfs,
    solve_dfs as maze_dfs,
    solve_astar as maze_astar,
    generate_maze,
)
from .sudoku import (
    solve_backtracking as sudoku_solve,
    generate_sudoku,
)

__all__ = [
    "MinHeap",
    "SolveStats",
    "eight_puzzle_bfs",
    "eight_puzzle_dfs",
    "eight_puzzle_astar",
    "generate_puzzle",
    "is_solvable",
    "maze_bfs",
    "maze_dfs",
    "maze_astar",
    "generate_maze",
    "sudoku_solve",
    "generate_sudoku",
]
