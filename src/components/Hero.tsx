import { useState } from "react";
import { Play, Radio, Zap, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAudioStore } from "@/stores/audioStore";
import { getDynamicTextClass } from "@/utils/textColors";

const HERO_GRADIENT = "from-blue-900/70 via-indigo-950/50 to-[#0d1117]";

const Hero = () => {
  const [showEnterScreen, setShowEnterScreen] = useState(true);
  const playWelcomeAudio = useAudioStore((state) => state.playWelcomeAndThenDefault);

  const handleEnterRadio = () => {
    setShowEnterScreen(false);
    playWelcomeAudio();
  };

  // Scroll to GenreStations section
  const scrollToGenreStations = () => {
    const section = document.getElementById('genre-stations-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Use dynamic text class for hero background
  const heroTextClass = getDynamicTextClass(HERO_GRADIENT);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* No local <audio> tag or audioRef here! */}

      {showEnterScreen && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md transition-opacity duration-500 ease-in-out">
          <div className="text-center p-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-[#b180fc] via-blue-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(177,128,252,0.5)]">
              ONKELGASHI RADIO
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-lg mx-auto">
              Prepare for an Immersive Sonic Journey.
            </p>
            <Button
              onClick={handleEnterRadio}
              size="lg"
              className="group text-xl sm:text-2xl font-semibold px-10 py-6 sm:px-12 sm:py-7 rounded-full 
                         bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 
                         hover:from-purple-500 hover:via-pink-400 hover:to-red-400
                         text-white shadow-2xl hover:shadow-[0_0_40px_10px_rgba(224,80,150,0.4)] 
                         transform hover:scale-110 transition-all duration-300 ease-in-out
                         focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-60
                         animate-pulse hover:animate-none"
              aria-label="Enter OnkelGashi Radio"
            >
              <PlayCircle className="w-7 h-7 sm:w-8 sm:h-8 mr-2 sm:mr-3 transition-transform duration-300 group-hover:rotate-[720deg] group-hover:scale-110" />
              ENTER THE FREQUENCY
            </Button>
            <p className="mt-8 text-sm text-gray-400 animate-fadeIn select-none">
              ( Welcome audio will play )
            </p>
          </div>
        </div>
      )}

      <div
        className={`w-full h-full flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
          showEnterScreen ? "opacity-0 pointer-events-none absolute" : "opacity-100 relative"
        }`}
      >
        {/* Spicy animated gradient background */}
        <div className={`absolute inset-0 spicy-bg bg-gradient-to-br ${HERO_GRADIENT} -z-10`} />
        {/* Animated blobs for extra depth */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-pulse left-1/4 top-1/3"></div>
          <div className="absolute w-80 h-80 bg-cyan-400/20 rounded-full blur-2xl animate-pulse right-1/4 bottom-1/4"></div>
        </div>
        <div className="absolute inset-0 pointer-events-none -z-20">
          {[...Array(120)].map((_, i) => (
            <div
              key={`star-${i}`}
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
        <div className="absolute -bottom-16 left-0 right-0 h-20 opacity-75 -z-10 pointer-events-none">
          <div className="flex items-end justify-center space-x-1.5 h-full">
            {[...Array(35)].map((_, i) => {
              const distanceFromCenter = Math.abs(i - Math.floor(35 / 2));
              const maxPeakHeight = 80; 
              const minPeakHeight = 20; 
              const peakinessFactor = Math.max(0, 1 - (distanceFromCenter / (35 / 2)) * 0.8); 

              const baseHeight = minPeakHeight + (maxPeakHeight - minPeakHeight) * peakinessFactor * 0.5; 
              const randomHeightFactor = Math.random() * (maxPeakHeight * 0.5 * peakinessFactor);

              return (
                <div
                  key={`wave-${i}`}
                  className="bg-gradient-to-t from-purple-600 to-pink-500 rounded-t" 
                  style={{
                    width: "4px", 
                    height: `${baseHeight + randomHeightFactor}%`, 
                    animationName: 'wavePulse', 
                    animationDuration: `${1 + Math.random() * 0.5}s`, 
                    animationDelay: `${distanceFromCenter * 0.05 + Math.random() * 0.1}s`, 
                    animationIterationCount: 'infinite',
                    animationTimingFunction: 'ease-in-out',
                    animationDirection: 'alternate',
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="relative z-20 text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Badge className="bg-red-600/20 text-red-400 border-red-500/30 px-4 py-2 text-sm font-medium">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              LIVE NOW
            </Badge>
          </div>
          <h1 className={`text-8xl sm:text-9xl font-black mb-2 bg-gradient-to-r from-[#b180fc] via-blue-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-xl tracking-wide`}>
            OnkelGashi
          </h1>
          <h2 className={`text-7xl sm:text-8xl font-black mb-8 bg-gradient-to-l from-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-xl tracking-wide`}>
            Radio
          </h2>
          <div className="flex items-center justify-center mb-4">
            <Radio className="w-6 h-6 text-cyan-400 mr-3" />
            <span className={`text-2xl sm:text-3xl lg:text-4xl font-light tracking-widest ${heroTextClass}`}>
              Sound for Hyperactive Minds & True Creators
            </span>
          </div>
          <p className={`text-xl sm:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed ${heroTextClass}`}>
            Enter a living digital soundscape—always genre-bending, always evolving.<br />
            <span className="text-cyan-300 font-bold">400+</span> tracks designed for restless focus, deep feels, and creative flow—streaming nonstop from the OG multiverse.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={scrollToGenreStations}
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 animate-pulse"
            >
              <Play className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              Tune In Live
            </Button>
            <Button
              onClick={scrollToGenreStations}
              variant="outline"
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 rounded-full text-lg transition-all duration-300"
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
      </div>
    </section>
  );
};

export default Hero;