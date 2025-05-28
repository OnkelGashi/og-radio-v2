import { ThemeProvider } from "next-themes"; // 1. Import ThemeProvider
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react";
import VisualizerDialog from "@/components/VisualizerDialog";
import { useAudioStore } from "@/stores/audioStore";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const setAudioElement = useAudioStore((s) => s.setAudioElement);
  const isVisualizerOpen = useAudioStore((s) => s.isVisualizerOpen);
  const setIsVisualizerOpen = useAudioStore((s) => s.setIsVisualizerOpen);

  useEffect(() => {
    if (audioRef.current) setAudioElement(audioRef.current);
  }, [setAudioElement]);

  return (
    // 2. Wrap your application with ThemeProvider
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SonnerToaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <audio ref={audioRef} preload="auto" />
          <VisualizerDialog
            isOpen={isVisualizerOpen}
            onClose={() => setIsVisualizerOpen(false)}
          />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
