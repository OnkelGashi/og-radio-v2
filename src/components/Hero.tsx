import { useEffect, useRef, useState } from "react";
import { Play, Radio, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getHeadingTextColorClass, getBodyTextColorClass } from "@/utils/textColors";

const Hero = ({ activeGenre }: { activeGenre?: string | null }) => {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [needUser, setNeedUser] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!hasPlayed) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => setHasPlayed(true))
            .catch(() => setNeedUser(true));
        }
      }, 600);
    }
  }, [hasPlayed]);

  const handleUserPlay = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setHasPlayed(true);
      setNeedUser(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <audio ref={audioRef} src="/Welcome.mp3" preload="auto" />
      {needUser && !hasPlayed && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
          <button
            className="px-10 py-6 rounded-full text-3xl font-black bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl hover:scale-105 transition-all"
            onClick={handleUserPlay}
          >
            ▶ Tap to Enter OG Radio
          </button>
          <div className="mt-6 text-xl text-cyan-200 font-semibold tracking-wider">
            Welcome audio will start
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/60 via-indigo-950/40 to-transparent"></div>
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              background: "rgba(255,255,255,0.22)",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.35 + 0.25,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>
      <div className="absolute -bottom-8 left-0 right-0 h-32 opacity-20 z-1 pointer-events-none">
        <div className="flex items-end justify-center space-x-1 h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-cyan-400 to-blue-500 rounded-t animate-pulse"
              style={{
                width: "3px",
                height: `${Math.random() * 100 + 20}%`,
                animationDelay: `${i * 50}ms`,
                animationDuration: `${Math.random() * 1000 + 1500}ms`,
              }}
            ></div>
          ))}
        </div>
      </div>
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <Badge className="bg-red-600/20 text-red-400 border-red-500/30 px-4 py-2 text-sm font-medium">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            LIVE NOW
          </Badge>
        </div>
        <h1 className="text-8xl sm:text-9xl font-black mb-2 bg-gradient-to-r from-[#b180fc] via-blue-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-xl tracking-wide">
          OnkelGashi
        </h1>
        <h2 className="text-7xl sm:text-8xl font-black mb-8 bg-gradient-to-l from-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-xl tracking-wide">
          Radio
        </h2>
        {/* Subheadline */}
        <div className="flex items-center justify-center mb-4">
          <Radio className="w-6 h-6 text-cyan-400 mr-3" />
          <span className={`text-2xl sm:text-3xl lg:text-4xl font-light tracking-widest ${getHeadingTextColorClass(activeGenre || null)}`}>
            Sound for Hyperactive Minds & True Creators
          </span>
        </div>
        {/* Tagline */}
        <p className={`text-xl sm:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed ${getBodyTextColorClass(activeGenre || null)}`}>
          Enter a living digital soundscape—always genre-bending, always evolving.<br />
          <span className="text-cyan-300 font-bold">400+</span> tracks designed for restless focus, deep feels, and creative flow—streaming nonstop from the OG multiverse.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 animate-pulse"
          >
            <Play className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
            Tune In Live
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-gray-600 text-black hover:bg-gray-800 hover:text-white px-8 py-4 rounded-full text-lg transition-all duration-300"
          >
            <Zap className="w-5 h-5 mr-2" />
            Explore Catalog
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto text-center -mt-12">
          <div>
            <div className="text-2xl font-bold text-cyan-400">400+</div>
            <div className="text-sm text-gray-400">Tracks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">24/7</div>
            <div className="text-sm text-gray-400">Live Stream</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">5+</div>
            <div className="text-sm text-gray-400">Genres</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
