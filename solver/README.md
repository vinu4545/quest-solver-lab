# Python Solver Module

Complete Python implementation of puzzle solving algorithms for the Quest Solver Lab.

## Directory Structure

```
solver/
├── __init__.py          # Package initialization
├── common.py            # Shared utilities (MinHeap, SolveStats)
├── eight_puzzle.py      # 8-puzzle solver (BFS, DFS, A*)
├── maze.py              # Maze solver (BFS, DFS, A*)
└── sudoku.py            # Sudoku solver (Backtracking + MRV)
```

## Implemented Algorithms

### 1. 8-Puzzle Solver (`eight_puzzle.py`)

Solves the classic 3x3 sliding puzzle with three different algorithms:

- **BFS (Breadth-First Search)**: Guarantees shortest path
- **DFS (Depth-First Search)**: Memory-efficient exploration with depth limit
- **A* (A-Star)**: Optimal pathfinding using Manhattan distance heuristic

**Features:**
- Solvability check using inversion counting
- Random puzzle generation by backward walking from goal state
- Manhattan distance heuristic for A*
- Node exploration limit (200,000) to prevent infinite loops

**Usage:**
```python
from solver.eight_puzzle import (
    generate_puzzle,
    solve_bfs,
    solve_dfs,
    solve_astar,
)

# Generate a puzzle
puzzle = generate_puzzle("medium")

# Solve with different algorithms
steps, stats = solve_bfs(puzzle)
steps, stats = solve_dfs(puzzle)
steps, stats = solve_astar(puzzle)
```

### 2. Maze Solver (`maze.py`)

Solves mazes generated using DFS recursive backtracking:

- **BFS**: Shortest path in maze
- **DFS**: Depth-first exploration
- **A***: Optimal pathfinding using Manhattan distance

**Features:**
- Perfect maze generation (always solvable)
- Three difficulty levels: easy (11x11), medium (19x19), hard (27x27)
- Position tracking and path reconstruction

**Usage:**
```python
from solver.maze import (
    generate_maze,
    solve_bfs,
    solve_dfs,
    solve_astar,
)

# Generate a maze
maze = generate_maze("hard")

# Solve with different algorithms
result = solve_bfs(maze)
result = solve_dfs(maze)
result = solve_astar(maze)

# Access results
print(f"Path length: {len(result.path)}")
print(f"Nodes explored: {result.stats.nodes_explored}")
```

### 3. Sudoku Solver (`sudoku.py`)

Solves sudoku puzzles using intelligent backtracking:

- **Backtracking with MRV (Minimum Remaining Values) Heuristic**
- Efficient cell selection based on constraint propagation
- Step recording for visualization

**Features:**
- Valid puzzle generation
- Three difficulty levels: easy (35 clues), medium (48 clues), hard (56 clues)
- MRV heuristic for faster solving
- Step-by-step solution tracking

**Usage:**
```python
from solver.sudoku import (
    generate_sudoku,
    solve_backtracking,
)

# Generate a puzzle
puzzle, solution = generate_sudoku("medium")

# Solve
result = solve_backtracking(puzzle, record_steps=True)

# Access results
print(f"Solved: {result.stats.found}")
print(f"Time: {result.stats.time_ms}ms")
print(f"Steps: {len(result.steps)}")
```

## Common Utilities (`common.py`)

### MinHeap Class
Priority queue implementation for A* algorithm:
- Efficient push/pop operations
- Stable sorting with counter-based tie-breaking
- Generic type support

### SolveStats Dataclass
Tracks solving statistics:
- `algorithm`: Algorithm name
- `steps`: Number of moves in solution
- `nodes_explored`: Total nodes explored
- `time_ms`: Execution time in milliseconds
- `found`: Whether solution was found

## Testing

Run the comprehensive test suite:
```bash
python test_solver.py
```

This runs tests for:
- Puzzle generation and solvability
- All three algorithms (BFS, DFS, A*)
- Statistics tracking
- Maze generation and solving
- Sudoku generation and solving

## Performance Notes

- **8-Puzzle A***: Typically solves medium puzzles in <50ms
- **Maze A***: Significantly faster than BFS/DFS, especially for large mazes
- **Sudoku**: MRV heuristic provides massive speedup vs naive backtracking
- All algorithms have node exploration limits to prevent excessive computation

## Implementation Details

### Heuristics
- **8-Puzzle**: Manhattan distance (sum of distances to goal positions)
- **Maze**: Manhattan distance between current and target
- **Sudoku**: MRV - fewest valid values remaining in cell

### Memory Usage
- Parent maps for path reconstruction
- Visited sets for cycle detection
- Closed sets for A* to avoid revisiting nodes

### Optimizations
- Random move ordering to avoid cycles in generation
- Constraint checking for valid moves
- Early termination on goal detection
