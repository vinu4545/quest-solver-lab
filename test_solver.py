"""Test suite for solver algorithms."""

import sys
from solver.eight_puzzle import (
    solve_bfs as puzzle_bfs,
    solve_dfs as puzzle_dfs,
    solve_astar as puzzle_astar,
    generate_puzzle,
    is_solvable,
    GOAL,
)
from solver.maze import (
    solve_bfs as maze_bfs,
    solve_dfs as maze_dfs,
    solve_astar as maze_astar,
    generate_maze,
)
from solver.sudoku import solve_backtracking, generate_sudoku


def test_eight_puzzle():
    """Test 8-puzzle solver."""
    print("\n=== 8-PUZZLE SOLVER TESTS ===\n")

    # Test goal detection
    print("Test 1: Goal state check")
    print(f"Goal state: {GOAL}")
    print(f"Is goal? {GOAL == GOAL}")

    # Test generation
    print("\nTest 2: Puzzle generation (easy difficulty)")
    puzzle = generate_puzzle("easy")
    print(f"Generated puzzle: {puzzle}")
    print(f"Is solvable? {is_solvable(puzzle)}")

    # Test BFS solver
    print("\nTest 3: BFS Solver")
    steps, stats = puzzle_bfs(puzzle)
    print(f"Algorithm: {stats.algorithm}")
    print(f"Found: {stats.found}")
    print(f"Steps: {stats.steps}")
    print(f"Nodes explored: {stats.nodes_explored}")
    print(f"Time: {stats.time_ms:.2f}ms")

    # Test DFS solver
    print("\nTest 4: DFS Solver")
    steps, stats = puzzle_dfs(puzzle)
    print(f"Algorithm: {stats.algorithm}")
    print(f"Found: {stats.found}")
    print(f"Steps: {stats.steps}")
    print(f"Nodes explored: {stats.nodes_explored}")
    print(f"Time: {stats.time_ms:.2f}ms")

    # Test A* solver
    print("\nTest 5: A* Solver")
    steps, stats = puzzle_astar(puzzle)
    print(f"Algorithm: {stats.algorithm}")
    print(f"Found: {stats.found}")
    print(f"Steps: {stats.steps}")
    print(f"Nodes explored: {stats.nodes_explored}")
    print(f"Time: {stats.time_ms:.2f}ms")


def test_maze():
    """Test maze solver."""
    print("\n=== MAZE SOLVER TESTS ===\n")

    # Test generation
    print("Test 1: Maze generation (easy difficulty)")
    maze = generate_maze("easy")
    print(f"Maze size: {maze.rows}x{maze.cols}")
    print(f"Start: ({maze.start.r}, {maze.start.c})")
    print(f"End: ({maze.end.r}, {maze.end.c})")

    # Test BFS solver
    print("\nTest 2: BFS Solver")
    result = maze_bfs(maze)
    print(f"Algorithm: {result.stats.algorithm}")
    print(f"Found: {result.stats.found}")
    print(f"Path length: {len(result.path)}")
    print(f"Nodes explored: {result.stats.nodes_explored}")
    print(f"Time: {result.stats.time_ms:.2f}ms")

    # Test DFS solver
    print("\nTest 3: DFS Solver")
    result = maze_dfs(maze)
    print(f"Algorithm: {result.stats.algorithm}")
    print(f"Found: {result.stats.found}")
    print(f"Path length: {len(result.path)}")
    print(f"Nodes explored: {result.stats.nodes_explored}")
    print(f"Time: {result.stats.time_ms:.2f}ms")

    # Test A* solver
    print("\nTest 4: A* Solver")
    result = maze_astar(maze)
    print(f"Algorithm: {result.stats.algorithm}")
    print(f"Found: {result.stats.found}")
    print(f"Path length: {len(result.path)}")
    print(f"Nodes explored: {result.stats.nodes_explored}")
    print(f"Time: {result.stats.time_ms:.2f}ms")


def test_sudoku():
    """Test sudoku solver."""
    print("\n=== SUDOKU SOLVER TESTS ===\n")

    # Test generation
    print("Test 1: Sudoku generation (easy difficulty)")
    puzzle, solution = generate_sudoku("easy")
    print("Generated puzzle (first 3x3):")
    for i in range(3):
        print("  " + str(puzzle[i][:3]))

    # Test solver
    print("\nTest 2: Backtracking Solver with MRV")
    result = solve_backtracking(puzzle)
    print(f"Algorithm: {result.stats.algorithm}")
    print(f"Found: {result.stats.found}")
    print(f"Steps recorded: {result.stats.steps}")
    print(f"Nodes explored: {result.stats.nodes_explored}")
    print(f"Time: {result.stats.time_ms:.2f}ms")


if __name__ == "__main__":
    try:
        test_eight_puzzle()
        test_maze()
        test_sudoku()
        print("\n=== ALL TESTS COMPLETED ===\n")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
