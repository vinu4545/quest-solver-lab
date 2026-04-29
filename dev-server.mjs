import { spawn } from "node:child_process";

const pythonProcess = spawn("python3", ["backend_server.py"], {
  stdio: "inherit",
  shell: false,
});

const viteProcess = spawn("npx", ["vite"], {
  stdio: "inherit",
  shell: false,
});

const shutdown = () => {
  pythonProcess.kill("SIGTERM");
  viteProcess.kill("SIGTERM");
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

pythonProcess.on("exit", (code) => {
  if (code !== 0) {
    viteProcess.kill("SIGTERM");
    process.exit(code ?? 1);
  }
});

viteProcess.on("exit", (code) => {
  if (code !== 0) {
    pythonProcess.kill("SIGTERM");
    process.exit(code ?? 1);
  }
});