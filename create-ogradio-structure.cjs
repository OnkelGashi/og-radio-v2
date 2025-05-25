import { useState, useRef, useEffect } from "react";
import { Play, Pause, Heart, Share2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SONG_SRC = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const NowPlaying = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle play/pause and progress updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }

    const update = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
    };
  }, [isPlaying]);

  // Try to autoplay on mount (will be blocked silently if browser policy)
  useEffect(() => {
    setIsPlaying(true);
  }, []);

  // Allow clicking progress bar to seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && duration) {
      audioRef.current.currentTime = percent * duration;
      setProgress(percent * duration);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <audio ref={audioRef} src={SONG_SRC} preload="auto" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Track Info */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h4 className="text-white font-medium">Faded Frequencies</h4>
              <p className="text-gray-400 text-sm">OnkelGashi • Future Bass</p>
            </div>
            <Badge className="bg-red-600/20 text-red-400 border-red-500/30 hidden md:inline-flex">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              LIVE
            </Badge>
          </div>
          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsLiked(!isLiked)}
              className={`text-gray-400 hover:text-white ${isLiked ? "text-red-400" : ""}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button
              size="sm"
              onClick={() => setIsPlaying((p) => !p)}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-full"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="pb-2">
          <div
            className="w-full bg-gray-800 rounded-full h-1 cursor-pointer relative"
            onClick={handleSeek}
          >
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full"
              style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
