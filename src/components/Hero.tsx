import NightModeToggle from "@/components/NightModeToggle";
import { useEffect, useState } from "react";
import { Play, Radio, Zap, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAudioStore } from "@/stores/audioStore";
import { useUIStore } from "@/stores/uiStore";
import { getDynamicTextClass } from "@/utils/textColors";

const Hero = () => {
  const [showEnterScreen, setShowEnterScreen] = useState(true);
  const playWelcomeAudio = useAudioStore((state) => state.playWelcomeAndThenDefault);
  const nightMode = useUIStore((s) => s.nightMode);

  // Prevent scrolling when overlay is visible
  useEffect(() => {
    if (showEnterScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Clean up on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showEnterScreen]);

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
  const heroTextClass = getDynamicTextClass("from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]");

  // 1. Genre gradient map (should match your AboutSection/GenreBackground)
  const genreGradientMap: Record<string, string> = {
    lofi: "from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]",
    "hip-hop": "from-[#F59E42] via-[#F43F5E] to-[#6366F1]",
    electronic: "from-[#06B6D4] via-[#818CF8] to-[#F472B6]",
    rap: "from-[#FBBF24] via-[#F87171] to-[#1E293B]",
    experimental: "from-[#C084FC] via-[#F472B6] to-[#F59E42]",
    rnb: "from-pink-700/60 via-pink-400/40 to-purple-900/80",
    indie: "from-[#c7d2fe] via-[#64748b]/70 to-[#161927]/95",
    ambient: "from-sky-900/80 via-teal-800/60 to-[#161927]",
    jazz: "from-amber-700/60 via-orange-400/40 to-orange-900/80",
    rock: "from-red-900/60 via-red-900/40 to-black",
    // ...add more as needed
  };
  const defaultGradient = "from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]";

  // 2. Helper to extract the last hex color from a gradient string
  function getLastGradientColor(gradient: string): string {
    const matches = gradient.match(/#(?:[A-Fa-f0-9]{6})/g);
    return matches ? matches[matches.length - 1] : "#181c32";
  }

  // 3. Get current genre and gradient
  const activeGenre = null; // <-- Replace with your actual genre state/prop
  const currentGradient = (activeGenre && genreGradientMap[activeGenre]) || defaultGradient;
  const bottomColor = getLastGradientColor(currentGradient);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* No local <audio> tag or audioRef here! */}

      {showEnterScreen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md transition-opacity duration-500 ease-in-out">
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
              className={`group text-xl sm:text-2xl font-semibold px-10 py-6 sm:px-12 sm:py-7 rounded-full
                ${nightMode
                  ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-gray-100"
                  : "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white"}
                shadow-2xl transform hover:scale-110 transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-60
                animate-pulse hover:animate-none`}
              aria-label="Enter OnkelGashi Radio"
            >
              <PlayCircle className="w-7 h-7 sm:w-8 sm:h-8 mr-2 sm:mr-3 transition-transform duration-300 group-hover:rotate-[720deg] group-hover:scale-110" />
              ENTER THE FREQUENCY
            </Button>
          </div>
        </div>
      )}

      <div
        className={`w-full h-full flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
          showEnterScreen ? "opacity-0 pointer-events-none absolute" : "opacity-100 relative"
        }`}
      >
        <div className="relative z-20 text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Badge className="bg-red-600/20 text-red-400 border-red-500/30 px-4 py-2 text-sm font-medium">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              LIVE NOW
            </Badge>
          </div>
          <h1 className={`text-8xl sm:text-9xl font-black mb-2 ${
            nightMode
              ? "bg-gradient-to-r from-gray-200 via-gray-400 to-gray-500 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-[#b180fc] via-blue-300 to-cyan-400 bg-clip-text text-transparent"
          } drop-shadow-xl tracking-wide`}>
            OnkelGashi
          </h1>

          <h2 className={`text-7xl sm:text-8xl font-black mb-8 ${
            nightMode
              ? "bg-gradient-to-l from-gray-400 to-gray-600 bg-clip-text text-transparent"
              : "bg-gradient-to-l from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          } drop-shadow-xl tracking-wide`}>
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
              className={`group px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
                ${nightMode
                  ? "bg-gradient-to-r from-gray-700 to-gray-900 text-gray-100"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-pulse"}
                hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/25`}
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
        </div>
      </div>
    </section>
  );
};

export default Hero;