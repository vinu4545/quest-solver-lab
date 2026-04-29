#!/usr/bin/env python3
"""
Quick Start Guide for Python Solver Algorithms
Run this file to see basic usage examples
"""

from solver.eight_puzzle import generate_puzzle, solve_bfs, solve_dfs, solve_astar
from solver.maze import generate_maze, solve_bfs as maze_bfs, solve_astar as maze_astar
from solver.sudoku import generate_sudoku, solve_backtracking


def print_header(title):
    """Print section header."""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def example_eight_puzzle():
    """Example: Solve an 8-puzzle."""
    print_header("8-PUZZLE SOLVER EXAMPLE")

    # Generate puzzle
    print("\n1. Generating a medium difficulty puzzle...")
    puzzle = generate_puzzle("medium")
    print(f"   Puzzle: {puzzle}")

    # Solve with A* (fastest)
    print("\n2. Solving with A* algorithm...")
    steps, stats = solve_astar(puzzle)

    print(f"\n   ✓ Solution found!")
    print(f"   - Algorithm: {stats.algorithm}")
    print(f"   - Steps: {stats.steps}")
    print(f"   - Nodes explored: {stats.nodes_explored}")
    print(f"   - Time: {stats.time_ms:.2f}ms")

    if steps:
        print(f"\n   First 3 moves:")
        for i, step in enumerate(steps[:3]):
            print(f"   {i+1}. {step.move}: {step.board}")


def example_maze():
    """Example: Solve a maze."""
    print_header("MAZE SOLVER EXAMPLE")

    # Generate maze
    print("\n1. Generating a hard difficulty maze (27x27)...")
    maze = generate_maze("hard")
    print(f"   Start: ({maze.start.r}, {maze.start.c})")
    print(f"   End: ({maze.end.r}, {maze.end.c})")

    # Solve with A*
    print("\n2. Solving with A* algorithm...")
    result = maze_astar(maze)

    print(f"\n   ✓ Solution found!")
    print(f"   - Algorithm: {result.stats.algorithm}")
    print(f"   - Path length: {len(result.path)} cells")
    print(f"   - Cells explored: {result.stats.nodes_explored}")
    print(f"   - Time: {result.stats.time_ms:.2f}ms")

    if result.path:
        print(f"\n   Path preview (first 5 steps):")
        for i, pos in enumerate(result.path[:5]):
            print(f"   {i+1}. Position: ({pos.r}, {pos.c})")


def example_sudoku():
    """Example: Solve a sudoku."""
    print_header("SUDOKU SOLVER EXAMPLE")

    # Generate puzzle
    print("\n1. Generating a hard difficulty sudoku...")
    puzzle, solution = generate_sudoku("hard")

    print("\n   Puzzle (first 3x3 of first row):")
    for i in range(3):
        print(f"   {puzzle[i][:3]}")

    # Solve
    print("\n2. Solving with Backtracking + MRV heuristic...")
    result = solve_backtracking(puzzle, record_steps=True)

    print(f"\n   ✓ Solution found!")
    print(f"   - Algorithm: {result.stats.algorithm}")
    print(f"   - Cells filled: {result.stats.steps}")
    print(f"   - Backtracks: {result.stats.nodes_explored - result.stats.steps}")
    print(f"   - Time: {result.stats.time_ms:.2f}ms")

    print("\n   Solution (first 3x3 of first row):")
    for i in range(3):
        print(f"   {result.solution[i][:3]}")


def example_algorithm_comparison():
    """Example: Compare algorithms on same puzzle."""
    print_header("ALGORITHM COMPARISON (8-PUZZLE)")

    print("\n1. Generating puzzle...")
    puzzle = generate_puzzle("medium")

    algorithms = [
        ("BFS", solve_bfs),
        ("DFS", solve_dfs),
        ("A*", solve_astar),
    ]

    print("\n2. Comparing algorithms:\n")
    print(f"{'Algorithm':<12} {'Steps':<8} {'Explored':<12} {'Time (ms)':<10}")
    print("-" * 42)

    for algo_name, solver in algorithms:
        steps, stats = solver(puzzle)
        print(
            f"{algo_name:<12} {stats.steps:<8} {stats.nodes_explored:<12} {stats.time_ms:<10.2f}"
        )

    print("\n   💡 Note: A* is optimized with Manhattan distance heuristic")


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("  QUEST SOLVER LAB - PYTHON SOLVER QUICK START")
    print("=" * 60)

    try:
        example_eight_puzzle()
        example_maze()
        example_sudoku()
        example_algorithm_comparison()

        print_header("SETUP COMPLETE ✅")
        print("""
The Python solver module is ready to use!

To use in your code:
  from solver import (
      solve_bfs, solve_dfs, solve_astar,
      generate_puzzle, generate_maze, generate_sudoku
  )

For more details, see solver/README.md
""")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback

        traceback.print_exc()
