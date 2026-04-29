"""Minimal HTTP server exposing the Python solver algorithms to the frontend."""

from __future__ import annotations

import json
from dataclasses import asdict, is_dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

from solver.eight_puzzle import (
    generate_puzzle,
    solve_astar as solve_eight_astar,
    solve_bfs as solve_eight_bfs,
    solve_dfs as solve_eight_dfs,
)
from solver.maze import (
    generate_maze,
    MazeData,
    Pos,
    solve_astar as solve_maze_astar,
    solve_bfs as solve_maze_bfs,
    solve_dfs as solve_maze_dfs,
)
from solver.sudoku import generate_sudoku, solve_backtracking

HOST = "127.0.0.1"
PORT = 8000


def to_jsonable(value: Any) -> Any:
    """Convert dataclasses and nested containers into JSON-serializable values."""
    # Prefer dataclasses.asdict for true dataclasses, but be resilient
    # if an object looks dataclass-like but isn't recognized by is_dataclass.
    try:
        if is_dataclass(value):
            return {key: to_jsonable(item) for key, item in asdict(value).items()}
    except Exception:
        # fall through to other handling
        pass
    # Fallback: if object exposes a __dict__, convert that
    if hasattr(value, "__dict__") and not isinstance(value, (str, bytes)):
        try:
            return {key: to_jsonable(item) for key, item in vars(value).items()}
        except Exception:
            pass
    if isinstance(value, dict):
        return {key: to_jsonable(item) for key, item in value.items()}
    if isinstance(value, list):
        return [to_jsonable(item) for item in value]
    if isinstance(value, tuple):
        return [to_jsonable(item) for item in value]
    return value


def stats_to_camel_case(stats: Any) -> dict[str, Any]:
    """Convert SolveStats objects to the camelCase shape used by the frontend."""
    data = to_jsonable(stats)
    return {
        "algorithm": data["algorithm"],
        "steps": data["steps"],
        "nodesExplored": data["nodes_explored"],
        "timeMs": data["time_ms"],
        "found": data["found"],
    }


def parse_pos(payload: dict[str, Any]) -> Pos:
    """Convert a plain JSON position object into a maze Pos dataclass."""
    return Pos(r=int(payload["r"]), c=int(payload["c"]))


def parse_maze_data(payload: dict[str, Any]) -> MazeData:
    """Convert maze JSON from the frontend into the MazeData dataclass expected by the solvers."""
    return MazeData(
        grid=payload["grid"],
        start=parse_pos(payload["start"]),
        end=parse_pos(payload["end"]),
        rows=int(payload["rows"]),
        cols=int(payload["cols"]),
    )


class SolverHandler(BaseHTTPRequestHandler):
    """HTTP handler for solver endpoints."""

    def _set_headers(self, status: int = 200) -> None:
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self) -> None:  # noqa: N802 - required by BaseHTTPRequestHandler
        self._set_headers(204)

    def do_GET(self) -> None:  # noqa: N802 - required by BaseHTTPRequestHandler
        if self.path == "/health":
            self._set_headers()
            self.wfile.write(json.dumps({"ok": True}).encode("utf-8"))
            return
        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))

    def do_POST(self) -> None:  # noqa: N802 - required by BaseHTTPRequestHandler
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode("utf-8"))
            return

        if self.path == "/api/generate":
            self.handle_generate(payload)
            return
        if self.path == "/api/solve":
            self.handle_solve(payload)
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))

    def handle_generate(self, payload: dict[str, Any]) -> None:
        puzzle_type = payload.get("type")
        difficulty = payload.get("difficulty", "medium")

        if puzzle_type == "8puzzle":
            self._set_headers()
            self.wfile.write(json.dumps({"eight": generate_puzzle(difficulty)}).encode("utf-8"))
            return

        if puzzle_type == "sudoku":
            puzzle, solution = generate_sudoku(difficulty)
            self._set_headers()
            self.wfile.write(
                json.dumps({"sudoku": {"puzzle": puzzle, "solution": solution}}).encode("utf-8")
            )
            return

        if puzzle_type == "maze":
            self._set_headers()
            self.wfile.write(
                json.dumps({"maze": to_jsonable(generate_maze(difficulty))}).encode("utf-8")
            )
            return

        self._set_headers(400)
        self.wfile.write(json.dumps({"error": "Unknown puzzle type"}).encode("utf-8"))

    def handle_solve(self, payload: dict[str, Any]) -> None:
        puzzle_type = payload.get("type")
        algorithm = payload.get("algorithm")

        if puzzle_type == "8puzzle":
            board = payload.get("board")
            if algorithm == "BFS":
                steps, stats = solve_eight_bfs(board)
            elif algorithm == "DFS":
                steps, stats = solve_eight_dfs(board)
            else:
                steps, stats = solve_eight_astar(board)

            self._set_headers()
            self.wfile.write(
                json.dumps(
                    {
                        "type": "8puzzle",
                        "algorithm": algorithm,
                        "stats": stats_to_camel_case(stats),
                        "eightSteps": to_jsonable(steps),
                    }
                ).encode("utf-8")
            )
            return

        if puzzle_type == "sudoku":
            puzzle = payload.get("puzzle")
            result = solve_backtracking(puzzle)
            self._set_headers()
            self.wfile.write(
                json.dumps(
                    {
                        "type": "sudoku",
                        "algorithm": "Backtracking",
                        "stats": stats_to_camel_case(result.stats),
                        "sudokuPuzzle": puzzle,
                        "sudokuSolution": result.solution,
                        "sudokuSteps": to_jsonable(result.steps),
                    }
                ).encode("utf-8")
            )
            return

        if puzzle_type == "maze":
            maze = parse_maze_data(payload.get("maze") or {})
            if algorithm == "BFS":
                result = solve_maze_bfs(maze)
            elif algorithm == "DFS":
                result = solve_maze_dfs(maze)
            else:
                result = solve_maze_astar(maze)

            self._set_headers()
            self.wfile.write(
                json.dumps(
                    {
                        "type": "maze",
                        "algorithm": algorithm,
                        "stats": stats_to_camel_case(result.stats),
                        "maze": to_jsonable(maze),
                        "mazeOrder": to_jsonable(result.order),
                        "mazePath": to_jsonable(result.path),
                    }
                ).encode("utf-8")
            )
            return

        self._set_headers(400)
        self.wfile.write(json.dumps({"error": "Unknown puzzle type"}).encode("utf-8"))


def main() -> None:
    """Run the solver API server."""
    server = ThreadingHTTPServer((HOST, PORT), SolverHandler)
    print(f"Python solver API running on http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down solver API server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()