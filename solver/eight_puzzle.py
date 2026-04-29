"""8-Puzzle solver algorithms (BFS, DFS, A*)."""

import random
import time
from collections import deque
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass

from .common import MinHeap, SolveStats

Board = List[int]  # 3x3 board with values 0..8 (0 = blank), length 9
GOAL: Board = [1, 2, 3, 4, 5, 6, 7, 8, 0]
NODE_LIMIT = 200_000


@dataclass
class PuzzleStep:
    """A step in puzzle solution."""

    board: Board
    move: str


def board_key(board: Board) -> str:
    """Convert board to key string."""
    return ",".join(map(str, board))


def swap(board: Board, i: int, j: int) -> Board:
    """Swap elements at positions i and j."""
    new_board = board.copy()
    new_board[i], new_board[j] = new_board[j], new_board[i]
    return new_board


def neighbors(board: Board) -> List[Tuple[Board, str]]:
    """Get all valid neighbor moves."""
    z = board.index(0)  # Find blank position
    r, c = z // 3, z % 3
    result = []

    moves = []
    if r > 0:
        moves.append((z - 3, "Up"))
    if r < 2:
        moves.append((z + 3, "Down"))
    if c > 0:
        moves.append((z - 1, "Left"))
    if c < 2:
        moves.append((z + 1, "Right"))

    for idx, move_name in moves:
        result.append((swap(board, z, idx), move_name))

    return result


def is_solvable(board: Board) -> bool:
    """Check if puzzle is solvable using inversion count."""
    # Filter out the blank (0) and count inversions
    non_zero = [x for x in board if x != 0]
    inversions = 0

    for i in range(len(non_zero)):
        for j in range(i + 1, len(non_zero)):
            if non_zero[i] > non_zero[j]:
                inversions += 1

    return inversions % 2 == 0


def is_goal(board: Board) -> bool:
    """Check if board is in goal state."""
    return board == GOAL


def manhattan(board: Board) -> int:
    """Manhattan distance heuristic."""
    distance = 0
    for i in range(9):
        if board[i] == 0:
            continue
        value = board[i]
        goal_i = value - 1
        current_r, current_c = i // 3, i % 3
        goal_r, goal_c = goal_i // 3, goal_i % 3
        distance += abs(current_r - goal_r) + abs(current_c - goal_c)

    return distance


def generate_puzzle(difficulty: str) -> Board:
    """Generate a random solvable puzzle by walking backwards from goal."""
    depth_map = {"easy": 12, "medium": 28, "hard": 60}
    depth = depth_map.get(difficulty, 28)

    board = GOAL.copy()
    prev_z = -1

    for _ in range(depth):
        moves = neighbors(board)
        # Filter out move that would undo previous move
        valid_moves = [
            (new_board, move)
            for new_board, move in moves
            if new_board.index(0) != prev_z
        ]

        if not valid_moves:
            valid_moves = moves

        new_board, _ = random.choice(valid_moves)
        prev_z = board.index(0)
        board = new_board

    # Ensure it's not already solved
    if is_goal(board):
        return generate_puzzle(difficulty)

    return board


def reconstruct_solution(
    start: Board,
    goal_key: Optional[str],
    parent: Dict[str, Tuple[str, str]],
    algorithm: str,
    explored: int,
    start_time: float,
) -> Tuple[List[PuzzleStep], SolveStats]:
    """Reconstruct solution path from parent map."""
    elapsed = (time.time() - start_time) * 1000
    found = goal_key is not None

    steps = []

    if found:
        # Reconstruct trail of keys
        trail = [goal_key]
        current_key = goal_key

        while parent.get(current_key):
            prev_key, _ = parent[current_key]
            trail.append(prev_key)
            current_key = prev_key

        trail.reverse()

        # Rebuild boards along trail
        boards_map = {board_key(start): start}
        current_board = start

        for i in range(1, len(trail)):
            target_key = trail[i]
            # Find neighbor with matching key
            for neighbor_board, move_name in neighbors(current_board):
                if board_key(neighbor_board) == target_key:
                    current_board = neighbor_board
                    boards_map[target_key] = current_board
                    steps.append(PuzzleStep(board=current_board, move=move_name))
                    break

    stats = SolveStats(
        algorithm=algorithm,
        steps=len(steps),
        nodes_explored=explored,
        time_ms=elapsed,
        found=found,
    )

    return steps, stats


def solve_bfs(start: Board) -> Tuple[List[PuzzleStep], SolveStats]:
    """Solve 8-puzzle using BFS."""
    start_time = time.time()
    visited = {board_key(start)}
    parent: Dict[str, Tuple[str, str]] = {}
    queue = deque([start])
    explored = 0
    goal_key = None

    while queue and explored < NODE_LIMIT:
        current = queue.popleft()
        explored += 1

        if is_goal(current):
            goal_key = board_key(current)
            break

        for neighbor_board, move_name in neighbors(current):
            key = board_key(neighbor_board)
            if key not in visited:
                visited.add(key)
                parent[key] = (board_key(current), move_name)
                queue.append(neighbor_board)

    return reconstruct_solution(start, goal_key, parent, "BFS", explored, start_time)


def solve_dfs(start: Board, max_depth: int = 30) -> Tuple[List[PuzzleStep], SolveStats]:
    """Solve 8-puzzle using DFS."""
    start_time = time.time()
    visited: Dict[str, int] = {board_key(start): 0}
    parent: Dict[str, Tuple[str, str]] = {}
    stack = [(start, 0)]
    explored = 0
    goal_key = None

    while stack and explored < NODE_LIMIT:
        current, depth = stack.pop()
        explored += 1

        if is_goal(current):
            goal_key = board_key(current)
            break

        if depth >= max_depth:
            continue

        for neighbor_board, move_name in neighbors(current):
            key = board_key(neighbor_board)
            prev_depth = visited.get(key)

            if prev_depth is None or prev_depth > depth + 1:
                visited[key] = depth + 1
                parent[key] = (board_key(current), move_name)
                stack.append((neighbor_board, depth + 1))

    return reconstruct_solution(start, goal_key, parent, "DFS", explored, start_time)


def solve_astar(start: Board) -> Tuple[List[PuzzleStep], SolveStats]:
    """Solve 8-puzzle using A* algorithm."""
    start_time = time.time()
    heap = MinHeap()
    g_score: Dict[str, int] = {board_key(start): 0}
    parent: Dict[str, Tuple[str, str]] = {}
    start_h = manhattan(start)
    heap.push(start_h, (start, 0))
    explored = 0
    goal_key = None
    closed = set()

    while not heap.empty() and explored < NODE_LIMIT:
        current, g = heap.pop()
        current_key = board_key(current)

        if current_key in closed:
            continue

        closed.add(current_key)
        explored += 1

        if is_goal(current):
            goal_key = current_key
            break

        for neighbor_board, move_name in neighbors(current):
            key = board_key(neighbor_board)
            tentative_g = g + 1

            if tentative_g < g_score.get(key, float("inf")):
                g_score[key] = tentative_g
                parent[key] = (current_key, move_name)
                h = manhattan(neighbor_board)
                heap.push(tentative_g + h, (neighbor_board, tentative_g))

    return reconstruct_solution(start, goal_key, parent, "A*", explored, start_time)
