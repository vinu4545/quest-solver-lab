# Quest Solver Lab

The puzzle solvers now live in Python under `solver/`, and the React frontend talks to them through a small local HTTP API.

## What runs where

- `solver/` contains the Python implementations for 8-puzzle, maze, and sudoku.
- `backend_server.py` exposes the Python solvers over HTTP.
- The React pages call that API for generate and solve actions.

## How to run it

Run everything with one command:

```bash
npm run dev
```

That starts both the Python API server and the Vite frontend together.

If you want to run them separately:

1. Start the API:
	```bash
	npm run api
	```

2. Start the frontend:
	```bash
	npm run dev
	```

The frontend URL is the one printed by Vite, usually `http://localhost:5173` or `http://localhost:8080`.

## Python solver commands

- `python3 test_solver.py` runs the solver test suite.
- `python3 quick_start.py` prints example runs for all puzzles.
- `python3 backend_server.py` starts only the solver API.

## API base URL

By default the frontend uses `http://127.0.0.1:8000`.
Set `VITE_SOLVER_API_URL` if you want to point it somewhere else.
