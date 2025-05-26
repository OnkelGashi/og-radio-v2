import { useEffect, useRef, useState } from "react";
import { Play, Radio, Zap, PlayCircle, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock function for text colors
const getHeadingTextColorClass = (genre: string | null) => "text-gray-200";
const getBodyTextColorClass = (genre: string | null) => "text-gray-200";

const Hero = ({ activeGenre }: { activeGenre?: string | null }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingWelcome, setIsPlayingWelcome] = useState(false);
  const [showEnterScreen, setShowEnterScreen] = useState(true); // Controls visibility of the enter screen

  const handleEnterRadio = () => {
    setShowEnterScreen(false);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlayingWelcome(true);
          // console.log('Welcome audio started after user interaction.');
        })
        .catch((error) => {
          console.error('Welcome audio play failed after interaction:', error);
          setIsPlayingWelcome(false);
        });
    }
  };

  useEffect(() => {
    const currentAudio = audioRef.current;
    const handleAudioEnd = () => {
      setIsPlayingWelcome(false);
      // console.log('Welcome audio finished.');
    };

    if (currentAudio) {
      currentAudio.addEventListener('ended', handleAudioEnd);
    }

    return () => {
      if (currentAudio) {
        currentAudio.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <audio ref={audioRef} src="/Welcome.mp3" preload="auto" />

      {/* New Highly Inviting Enter Screen */}
      {showEnterScreen && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-500 ease-in-out">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-[#b180fc] via-blue-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
              ONKELGASHI RADIO
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-10">
              Prepare for a Sonic Journey.
            </p>
            <Button
              onClick={handleEnterRadio}
              size="lg"
              className="group text-xl sm:text-2xl font-semibold px-10 py-6 sm:px-12 sm:py-7 rounded-full 
                         bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 
                         hover:from-purple-700 hover:via-pink-600 hover:to-red-600
                         text-white shadow-2xl hover:shadow-[0_0_30px_5px_rgba(255,255,255,0.3)] 
                         transform hover:scale-105 transition-all duration-300 ease-in-out
                         focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50
                         animate-pulse hover:animate-none"
              aria-label="Enter OnkelGashi Radio"
            >
              <PlayCircle className="w-7 h-7 sm:w-8 sm:h-8 mr-2 sm:mr-3 transition-transform duration-300 group-hover:rotate-[360deg]" />
              ENTER THE FREQUENCY
            </Button>
            <p className="mt-6 text-sm text-gray-400">
              (Welcome audio will play)
            </p>
          </div>
        </div>
      )}

      {/* Main Hero Content (becomes visible after enter screen) */}
      {!showEnterScreen && (
        <>
          <div className="absolute inset-0 bg-gradient-radial from-blue-900/60 via-indigo-950/40 to-transparent"></div>
          {/* Animated Star BG */}
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
          {/* Animated Waveform - Moved lower */}
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
            {/* Live Badge */}
            <div className="flex justify-center mb-6">
              <Badge className="bg-red-600/20 text-red-400 border-red-500/30 px-4 py-2 text-sm font-medium">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                LIVE NOW
              </Badge>
            </div>
            {/* Main Title */}
            <h1 className={`text-8xl sm:text-9xl font-black mb-2 bg-gradient-to-r from-[#b180fc] via-blue-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-xl tracking-wide`}>
              OnkelGashi
            </h1>
            <h2 className={`text-7xl sm:text-8xl font-black mb-8 bg-gradient-to-l from-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-xl tracking-wide`}>
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
            {/* CTA Buttons */}
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
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 rounded-full text-lg transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                Explore Catalog
              </Button>
            </div>
            {/* Stats */}
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
        </>
      )}
    </section>
  );
};

export default Hero;