import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopNav } from "@/components/TopNav";
import { PuzzleProvider } from "@/state/puzzle";
import { SolutionProvider } from "@/state/solution";
import Home from "./pages/Home";
import Generate from "./pages/Generate";
import Solve from "./pages/Solve";
import Visualize from "./pages/Visualize";
import Explain from "./pages/Explain";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PuzzleProvider>
          <SolutionProvider>
            <div className="min-h-screen">
              <TopNav />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/solve" element={<Solve />} />
                <Route path="/visualize" element={<Visualize />} />
                <Route path="/explain" element={<Explain />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </SolutionProvider>
        </PuzzleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
