🚀 FINAL WEBSITE GENERATION PROMPT

You are a Senior AI Systems Architect, Full-Stack Developer, and Game Intelligence Engineer.

Your task is to design and build a complete, modern, multi-page web application called:

🧩 “Intelligent Puzzle Game Generator & Solver”

This platform simulates an AI-powered puzzle system that:
- 🔹 Generates puzzles dynamically (not hardcoded)
- 🔹 Solves puzzles using AI search algorithms
- 🔹 Provides step-by-step reasoning and visualization
- 🔹 Demonstrates Search, Knowledge Representation, and Planning

The website must be visually attractive, modern, and include smooth animations.

==================================================
🎯 CORE FEATURES
==================================================

- 🧠 Dynamic Puzzle Generation (valid & solvable only)
- 🤖 AI-based Puzzle Solving (BFS, DFS, A*, Backtracking)
- 🔄 Step-by-step solution visualization
- 📊 Explainable AI reasoning
- ⏱️ Performance metrics (steps, nodes, time)

==================================================
🧩 SUPPORTED PUZZLES (MVP)
==================================================

- 🔢 8-Puzzle (Sliding Puzzle)
- 🧮 Sudoku Solver
- 🧭 Maze Solver

==================================================
🌐 WEBSITE STRUCTURE (MULTI-PAGE)
==================================================

1. 🏠 Home Page
   - Project overview
   - AI concept explanation
   - Buttons:
     - ▶️ Generate Puzzle
     - 🧠 Solve Puzzle

2. ⚙️ Puzzle Generator Page
   - Select puzzle type
   - Select difficulty (Easy / Medium / Hard)
   - Generate puzzle dynamically
   - Visual display of puzzle

3. 🧠 Puzzle Solver Page
   - Input puzzle OR use generated one
   - Select algorithm:
     - BFS
     - DFS
     - A*
     - Backtracking (Sudoku)
   - ▶️ Solve button

4. 🔄 Solution Visualization Page
   - Step-by-step transitions
   - Highlight moves
   - Show solution path

5. 📘 AI Explanation Page
   - Algorithm used
   - Heuristic (for A*)
   - Time complexity
   - Nodes explored
   - Reasoning behind solution

==================================================
🧠 AI CORE LOGIC
==================================================

🔍 SEARCH:
- BFS → shortest path
- DFS → deep exploration
- A* → heuristic optimal search
- Backtracking → constraint solving

📦 KNOWLEDGE REPRESENTATION:
- 8-Puzzle → 2D array state
- Sudoku → constraint grid
- Maze → graph (nodes & edges)

🧭 PLANNING:
- Generate sequence of actions:
  - Move tile
  - Fill cell
  - Navigate path

==================================================
⚙️ PUZZLE GENERATION RULES
==================================================

- ✅ Only valid and solvable puzzles
- ❌ Avoid already solved states
- 📈 Difficulty controls complexity

==================================================
📊 SOLVER OUTPUT
==================================================

- 🔢 Total steps
- 🌐 Nodes explored
- ⏱️ Time taken
- 🧭 Solution path

==================================================
🎨 UI/UX REQUIREMENTS
==================================================

- 🌙 Dark modern theme
- 🎮 Interactive puzzle boards
- ✨ Smooth animations
- 🎛️ Controls: Play / Pause / Next
- 🎨 Color coding:
  - Current state
  - Goal state
  - Active transitions

==================================================
⚡ BACKEND REQUIREMENTS
==================================================

- 🐍 Python (FastAPI / Flask) OR Node.js
- Modular structure:
  - Generator module
  - Solver module
  - Visualization module

==================================================
💻 FRONTEND REQUIREMENTS
==================================================

- ⚛️ React.js OR HTML/CSS/JS
- Dynamic rendering
- Step visualization controls

==================================================
🔒 VALIDATION RULES
==================================================

- ❌ No invalid states
- ❌ No unsolvable puzzles
- ❌ No infinite loops
- ✅ Enforce constraints

==================================================
🚀 ADVANCED FEATURES (OPTIONAL)
==================================================

- 📊 Algorithm comparison (BFS vs A*)
- 📈 Performance graphs
- 🤖 Adaptive difficulty
- 👥 Multiplayer puzzles

==================================================
🚫 RESTRICTIONS
==================================================

DO NOT:
- ❌ Hardcode puzzles
- ❌ Fake AI logic
- ❌ Skip solving steps
- ❌ Build UI without intelligence

==================================================
🏁 GOAL
==================================================

Deliver a working MVP that clearly demonstrates:

🧠 Search + Knowledge Representation + Planning  
through an intelligent, interactive puzzle system.
