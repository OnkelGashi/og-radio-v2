import { ThemeProvider } from "next-themes";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAudioStore } from "@/stores/audioStore";

import VisualizerDialog from "@/components/VisualizerDialog";
import NightModeToggle from "@/components/NightModeToggle";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AudioProvider = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const setAudioElement = useAudioStore((s) => s.setAudioElement);

  useEffect(() => {
    if (audioRef.current) setAudioElement(audioRef.current);
    return () => setAudioElement(null);
  }, [setAudioElement]);

  return <audio ref={audioRef} />;
};

const App = () => {
  const isVisualizerOpen = useAudioStore((s) => s.isVisualizerOpen);
  const setIsVisualizerOpen = useAudioStore((s) => s.setIsVisualizerOpen);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* Night Mode Toggle Button */}
      <NightModeToggle />
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SonnerToaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <VisualizerDialog
            isOpen={isVisualizerOpen}
            onClose={() => setIsVisualizerOpen(false)}
          />
        </TooltipProvider>
      </QueryClientProvider>
      <AudioProvider />
    </ThemeProvider>
  );
};

export default App;
