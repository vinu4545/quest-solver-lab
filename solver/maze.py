"""Maze solver algorithms (BFS, DFS, A*)."""

import random
import time
from collections import deque
from typing import List, Dict, Tuple, Set
from dataclasses import dataclass

from .common import MinHeap, SolveStats

Cell = int  # 0 = path, 1 = wall
Maze = List[List[Cell]]


@dataclass
class Pos:
    """Position in maze."""

    r: int
    c: int

    def __hash__(self):
        return hash((self.r, self.c))

    def __eq__(self, other):
        if isinstance(other, Pos):
            return self.r == other.r and self.c == other.c
        return False

    def __lt__(self, other):
        return (self.r, self.c) < (other.r, other.c)


@dataclass
class MazeData:
    """Maze data structure."""

    grid: Maze
    start: Pos
    end: Pos
    rows: int
    cols: int


@dataclass
class MazeStep:
    """Single step in maze exploration."""

    explored: List[Pos]
    path: List[Pos]


@dataclass
class MazeSolveResult:
    """Result of maze solving."""

    order: List[Pos]
    path: List[Pos]
    stats: SolveStats


def pos_key(pos: Pos) -> str:
    """Convert position to key."""
    return f"{pos.r},{pos.c}"


def get_neighbors(grid: Maze, pos: Pos) -> List[Pos]:
    """Get valid neighbors of a position."""
    neighbors = []
    rows, cols = len(grid), len(grid[0])

    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nr, nc = pos.r + dr, pos.c + dc
        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
            neighbors.append(Pos(nr, nc))

    return neighbors


def generate_maze(difficulty: str) -> MazeData:
    """Generate maze using DFS recursive backtracker."""
    size_map = {"easy": 11, "medium": 19, "hard": 27}
    size = size_map.get(difficulty, 19)
    rows, cols = size, size

    # Initialize grid with all walls
    grid: Maze = [[1 for _ in range(cols)] for _ in range(rows)]

    # DFS backtracker
    stack = [Pos(1, 1)]
    grid[1][1] = 0

    while stack:
        current = stack[-1]
        # All four directions with random order
        directions = [(-2, 0), (2, 0), (0, -2), (0, 2)]
        random.shuffle(directions)

        carved = False
        for dr, dc in directions:
            nr, nc = current.r + dr, current.c + dc

            if (
                0 < nr < rows - 1
                and 0 < nc < cols - 1
                and grid[nr][nc] == 1
            ):
                # Carve path between current and next
                grid[current.r + dr // 2][current.c + dc // 2] = 0
                grid[nr][nc] = 0
                stack.append(Pos(nr, nc))
                carved = True
                break

        if not carved:
            stack.pop()

    return MazeData(
        grid=grid,
        start=Pos(1, 1),
        end=Pos(rows - 2, cols - 2),
        rows=rows,
        cols=cols,
    )


def reconstruct_path(
    start: Pos, end: Pos, parent: Dict[str, str], found: bool
) -> List[Pos]:
    """Reconstruct path from parent map."""
    if not found:
        return []

    path = []
    current_key = pos_key(end)

    while current_key:
        r, c = map(int, current_key.split(","))
        path.append(Pos(r, c))

        if current_key == pos_key(start):
            break

        current_key = parent.get(current_key)

    return list(reversed(path))


def solve_bfs(maze: MazeData) -> MazeSolveResult:
    """Solve maze using BFS."""
    start_time = time.time()
    parent: Dict[str, str] = {}
    visited: Set[str] = {pos_key(maze.start)}
    order: List[Pos] = []
    queue = deque([maze.start])
    found = False

    while queue:
        current = queue.popleft()
        order.append(current)

        if current.r == maze.end.r and current.c == maze.end.c:
            found = True
            break

        for neighbor in get_neighbors(maze.grid, current):
            key = pos_key(neighbor)
            if key not in visited:
                visited.add(key)
                parent[key] = pos_key(current)
                queue.append(neighbor)

    path = reconstruct_path(maze.start, maze.end, parent, found)
    elapsed = (time.time() - start_time) * 1000

    stats = SolveStats(
        algorithm="BFS",
        steps=max(0, len(path) - 1),
        nodes_explored=len(order),
        time_ms=elapsed,
        found=found,
    )

    return MazeSolveResult(order=order, path=path, stats=stats)


def solve_dfs(maze: MazeData) -> MazeSolveResult:
    """Solve maze using DFS."""
    start_time = time.time()
    parent: Dict[str, str] = {}
    visited: Set[str] = {pos_key(maze.start)}
    order: List[Pos] = []
    stack = [maze.start]
    found = False

    while stack:
        current = stack.pop()
        order.append(current)

        if current.r == maze.end.r and current.c == maze.end.c:
            found = True
            break

        for neighbor in get_neighbors(maze.grid, current):
            key = pos_key(neighbor)
            if key not in visited:
                visited.add(key)
                parent[key] = pos_key(current)
                stack.append(neighbor)

    path = reconstruct_path(maze.start, maze.end, parent, found)
    elapsed = (time.time() - start_time) * 1000

    stats = SolveStats(
        algorithm="DFS",
        steps=max(0, len(path) - 1),
        nodes_explored=len(order),
        time_ms=elapsed,
        found=found,
    )

    return MazeSolveResult(order=order, path=path, stats=stats)


def solve_astar(maze: MazeData) -> MazeSolveResult:
    """Solve maze using A*."""
    start_time = time.time()

    def heuristic(pos: Pos) -> int:
        """Manhattan distance heuristic."""
        return abs(pos.r - maze.end.r) + abs(pos.c - maze.end.c)

    heap = MinHeap()
    g_score: Dict[str, int] = {pos_key(maze.start): 0}
    parent: Dict[str, str] = {}
    closed: Set[str] = set()
    order: List[Pos] = []

    start_h = heuristic(maze.start)
    heap.push(start_h, maze.start)
    found = False

    while not heap.empty():
        current = heap.pop()
        current_key = pos_key(current)

        if current_key in closed:
            continue

        closed.add(current_key)
        order.append(current)

        if current.r == maze.end.r and current.c == maze.end.c:
            found = True
            break

        current_g = g_score[current_key]

        for neighbor in get_neighbors(maze.grid, current):
            key = pos_key(neighbor)
            tentative_g = current_g + 1

            if tentative_g < g_score.get(key, float("inf")):
                g_score[key] = tentative_g
                parent[key] = current_key
                f_score = tentative_g + heuristic(neighbor)
                heap.push(f_score, neighbor)

    path = reconstruct_path(maze.start, maze.end, parent, found)
    elapsed = (time.time() - start_time) * 1000

    stats = SolveStats(
        algorithm="A*",
        steps=max(0, len(path) - 1),
        nodes_explored=len(order),
        time_ms=elapsed,
        found=found,
    )

    return MazeSolveResult(order=order, path=path, stats=stats)
