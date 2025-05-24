import { useState } from "react";
import { Play, Pause, Heart, Share2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NowPlaying = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Track Info */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            
            <div className="hidden sm:block">
              <h4 className="text-white font-medium">Midnight Frequencies</h4>
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
              className={`text-gray-400 hover:text-white ${isLiked ? 'text-red-400' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
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
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full animate-pulse" style={{ width: '35%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
