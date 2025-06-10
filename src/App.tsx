
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Homepage from "./pages/Homepage";
import TokensPage from "./pages/TokensPage";
import IndexPage from "./pages/IndexPage";
import LiquidityPoolsPage from "./pages/LiquidityPoolsPage";
import InfoPage from "./pages/InfoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background overflow-x-hidden">
          <Navbar />
          <main className="min-w-0 w-full">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/tokens" element={<TokensPage />} />
              <Route path="/index" element={<IndexPage />} />
              <Route path="/liquidity-pools" element={<LiquidityPoolsPage />} />
              <Route path="/info" element={<InfoPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
