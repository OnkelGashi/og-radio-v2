import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, X } from "lucide-react";
import { useAudioStore } from "@/stores/audioStore";
import SynestheticCanvas from "@/components/SynestheticCanvas";
import { cn } from "@/lib/utils";

interface VisualizerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const VisualizerDialog: React.FC<VisualizerDialogProps> = ({ isOpen, onClose }) => {
  // ✅ Hooks go here, inside the component!
  const activeGenreForTheme = useAudioStore(s => s.activeGenreForTheme);
  const isPlaying = useAudioStore(s => s.isPlaying);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Fullscreen logic
  const toggleFullscreen = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        if (isFullscreen) document.exitFullscreen?.();
      }
    }}>
      <DialogContent
        className={cn(
          "flex flex-col p-0 border-none bg-transparent shadow-none max-w-full max-h-full",
          isFullscreen
            ? "fixed inset-0 w-full h-full rounded-none"
            : "w-[90vw] h-[90vh] md:w-[70vw] md:h-[70vh] rounded-lg"
        )}
      >
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
            title="Close Visualizer"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 w-full h-full relative overflow-hidden rounded-lg">
          <SynestheticCanvas activeGenre={activeGenreForTheme} />
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-lg font-semibold pointer-events-none">
              Play music to see the visualizer!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisualizerDialog;