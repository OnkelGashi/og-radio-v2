import { useState, useEffect, useMemo } from "react";
import { Disc, Radio, PlayCircle, PauseCircle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAudioStore, NowPlayingInfo } from "@/stores/audioStore";
import { getContrastYIQ } from "@/utils/getContrastYIQ";
import { getAverageGradientHex } from "@/utils/colorUtils";
import { getDynamicTextClass } from "@/utils/textColors";

// --- GENRE COLORS ---
const genreColors = {
  "hip-hop":    { background: "bg-hiphop",   text: "text-yellow-200" },
  "electronic": { background: "bg-electronic", text: "text-cyan-100" },
  "rap":        { background: "bg-rap",      text: "text-pink-100" },
  "rnb":        { background: "bg-rnb",      text: "text-rose-50" },
  "indie":      { background: "bg-indie",    text: "text-gray-100" },
  "ambient":    { background: "bg-ambient",  text: "text-teal-50" },
  "jazz":       { background: "bg-jazz",     text: "text-amber-100" },
  "rock":       { background: "bg-rock",     text: "text-red-100" },
  "lofi":       { background: "bg-lofi",     text: "text-indigo-100" },
  "experimental": { background: "bg-experimental", text: "text-fuchsia-100" },
  "default":    { background: "bg-default-og", text: "text-white" }
};

// --- GENRE DATA ---
export const genreStations = [
  {
    id: "hip-hop",
    name: "Street Art Burst",
    color: "from-[#FF00FF] via-[#FFFF00] to-[#00CCFF]",
    description: "Bold, energetic, raw, urban, with a hint of grit.",
    stations: [
      { id: "hh1", name: "Urban Beats", src: "/audio/stations/hip-hop/urban_beats.mp3", genreTag: "Hip Hop", listeners: 238, isLive: true },
      { id: "hh2", name: "Lyrical Flow", src: "/audio/stations/hip-hop/lyrical_flow.mp3", genreTag: "Hip Hop", listeners: 174, isLive: false },
      { id: "hh3", name: "Classic Hip Hop", src: "/audio/stations/hip-hop/classic_hip_hop.mp3", genreTag: "Hip Hop", listeners: 202, isLive: true },
      { id: "hh4", name: "Trap Nation", src: "/audio/stations/hip-hop/trap_nation.mp3", genreTag: "Hip Hop", listeners: 312, isLive: true },
    ]
  },
  {
    id: "electronic",
    name: "Neon Circuitry",
    color: "from-[#0A0A2A] via-[#6600FF] to-[#00FFFF]",
    description: "Futuristic, pulsing, digital, dark with bright accents.",
    stations: [
      { id: "el1", name: "Future Bass", src: "/audio/stations/electronic/future_bass.mp3", genreTag: "Electronic", listeners: 189, isLive: true },
      { id: "el2", name: "Deep House", src: "/audio/stations/electronic/deep_house.mp3", genreTag: "Electronic", listeners: 246, isLive: true },
      { id: "el3", name: "Techno Lab", src: "/audio/stations/electronic/techno_lab.mp3", genreTag: "Electronic", listeners: 158, isLive: false },
      { id: "el4", name: "EDM Central", src: "/audio/stations/electronic/edm_central.mp3", genreTag: "Electronic", listeners: 298, isLive: true },
    ]
  },
  {
    id: "rap",
    name: "Concrete Jungle Sunset",
    color: "from-[#333333] via-[#FF6600] to-[#FFCC00]",
    description: "Gritty, powerful, storytelling, evolving from dark to light.",
    stations: [
      { id: "rp1", name: "Rap Caviar", src: "/audio/stations/rap/rap_caviar.mp3", genreTag: "Rap", listeners: 267, isLive: true },
      { id: "rp2", name: "Bars & Verses", src: "/audio/stations/rap/bars_and_verses.mp3", genreTag: "Rap", listeners: 183, isLive: false },
      { id: "rp3", name: "Trap Beats", src: "/audio/stations/rap/trap_beats.mp3", genreTag: "Rap", listeners: 219, isLive: true },
      { id: "rp4", name: "Freestyle Lab", src: "/audio/stations/rap/freestyle_lab.mp3", genreTag: "Rap", listeners: 156, isLive: true },
    ]
  },
  {
    id: "rnb",
    name: "Velvet Groove",
    color: "from-[#4A0033] via-[#800040] to-[#FF99CC]",
    description: "Smooth, sensual, soulful, luxurious, intimate.",
    stations: [
      { id: "rb1", name: "Soul Sessions", src: "/audio/stations/rnb/soul_sessions.mp3", genreTag: "R&B", listeners: 176, isLive: true },
      { id: "rb2", name: "Modern R&B", src: "/audio/stations/rnb/modern_rnb.mp3", genreTag: "R&B", listeners: 203, isLive: true },
      { id: "rb3", name: "R&B Classics", src: "/audio/stations/rnb/rnb_classics.mp3", genreTag: "R&B", listeners: 184, isLive: false },
      { id: "rb4", name: "Slow Jams", src: "/audio/stations/rnb/slow_jams.mp3", genreTag: "R&B", listeners: 142, isLive: true },
    ]
  },
  {
    id: "indie",
    name: "Whimsical Dreamscape",
    color: "from-[#6B7A8F] via-[#A7C7E7] to-[#E6E6FA]", // deeper blue-gray to pastel
    description: "Ethereal, dreamy, slightly melancholic but hopeful, organic.",
    stations: [
      { id: "in1", name: "Indie Discoveries", src: "/audio/stations/indie/indie_discoveries.mp3", genreTag: "Indie", listeners: 164, isLive: true },
      { id: "in2", name: "Alternative Waves", src: "/audio/stations/indie/alternative_waves.mp3", genreTag: "Indie", listeners: 149, isLive: false },
      { id: "in3", name: "Indie Pop", src: "/audio/stations/indie/indie_pop.mp3", genreTag: "Indie", listeners: 187, isLive: true },
      { id: "in4", name: "Lo-Fi Beats Station", src: "/audio/stations/indie/lofi_beats_station.mp3", genreTag: "Indie", listeners: 221, isLive: true },
    ]
  },
  {
    id: "ambient",
    name: "Nebula Drift",
    color: "from-[#0D0D1A] via-[#330066] via-[#66FFFF] to-[#1A2980]",
    description: "Expansive, calm, ethereal, space-like, meditative.",
    stations: [
      { id: "am1", name: "Chill Atmospheres", src: "/audio/stations/ambient/chill_atmospheres.mp3", genreTag: "Ambient", listeners: 198, isLive: true },
      { id: "am2", name: "Focus Flow", src: "/audio/stations/ambient/focus_flow.mp3", genreTag: "Ambient", listeners: 226, isLive: true },
      { id: "am3", name: "Sleep Sounds", src: "/audio/stations/ambient/sleep_sounds.mp3", genreTag: "Ambient", listeners: 174, isLive: false },
      { id: "am4", name: "Ambient Worlds", src: "/audio/stations/ambient/ambient_worlds.mp3", genreTag: "Ambient", listeners: 163, isLive: true },
    ]
  },
  {
    id: "jazz",
    name: "Midnight Speakeasy",
    color: "from-[#1A1A1A] via-[#4F4F4F] to-[#B28B00]",
    description: "Sophisticated, smooth, improvisational, smoky, intimate.",
    stations: [
      { id: "jz1", name: "Jazz Classics", src: "/audio/stations/jazz/jazz_classics.mp3", genreTag: "Jazz", listeners: 148, isLive: true },
      { id: "jz2", name: "Modern Jazz", src: "/audio/stations/jazz/modern_jazz.mp3", genreTag: "Jazz", listeners: 132, isLive: false },
      { id: "jz3", name: "Fusion Lab", src: "/audio/stations/jazz/fusion_lab.mp3", genreTag: "Jazz", listeners: 126, isLive: true },
      { id: "jz4", name: "Late Night Jazz", src: "/audio/stations/jazz/late_night_jazz.mp3", genreTag: "Jazz", listeners: 157, isLive: true },
    ]
  },
  {
    id: "rock",
    name: "Rebel Sunset",
    color: "from-[#330000] via-[#CC0000] to-[#FF9900]",
    description: "Powerful, raw, rebellious, anthemic, passionate.",
    stations: [
      { id: "rk1", name: "Classic Rock", src: "/audio/stations/rock/classic_rock.mp3", genreTag: "Rock", listeners: 213, isLive: true },
      { id: "rk2", name: "Alternative Rock", src: "/audio/stations/rock/alternative_rock.mp3", genreTag: "Rock", listeners: 187, isLive: true },
      { id: "rk3", name: "Indie Rock Station", src: "/audio/stations/rock/indie_rock_station.mp3", genreTag: "Rock", listeners: 154, isLive: false },
      { id: "rk4", name: "Hard Rock", src: "/audio/stations/rock/hard_rock.mp3", genreTag: "Rock", listeners: 176, isLive: true },
    ]
  },
  {
    id: "lofi",
    name: "Retro Chill",
    color: "from-[#A0522D] via-[#E0BBE4] to-[#957DAD]",
    description: "Nostalgic, warm, slightly imperfect, relaxed, analogue feel.",
    stations: [
      { id: "lf1", name: "Lo-Fi Study", src: "/audio/stations/lofi/lofi_study.mp3", genreTag: "Lo-Fi", listeners: 284, isLive: true },
      { id: "lf2", name: "Chill Hop", src: "/audio/stations/lofi/chill_hop.mp3", genreTag: "Lo-Fi", listeners: 246, isLive: true },
      { id: "lf3", name: "Jazzy Beats", src: "/audio/stations/lofi/jazzy_beats.mp3", genreTag: "Lo-Fi", listeners: 193, isLive: false },
      { id: "lf4", name: "Sleepy Lofi", src: "/audio/stations/lofi/sleepy_lofi.mp3", genreTag: "Lo-Fi", listeners: 218, isLive: true },
    ]
  },
  {
    id: "experimental",
    name: "Algorithmic Glitch",
    color: "from-[#FF0000] via-[#00FF00] to-[#0000FF]",
    description: "Unpredictable, abstract, digital distortion, pushing boundaries.",
    stations: [
      { id: "ex1", name: "Sound Design", src: "/audio/stations/experimental/sound_design.mp3", genreTag: "Experimental", listeners: 129, isLive: true },
      { id: "ex2", name: "Avant-Garde", src: "/audio/stations/experimental/avant_garde.mp3", genreTag: "Experimental", listeners: 112, isLive: false },
      { id: "ex3", name: "Glitch Lab", src: "/audio/stations/experimental/glitch_lab.mp3", genreTag: "Experimental", listeners: 134, isLive: true },
      { id: "ex4", name: "Future Sounds", src: "/audio/stations/experimental/future_sounds.mp3", genreTag: "Experimental", listeners: 156, isLive: true },
    ]
  }
]; // <--- Make sure this closes the array!

type Props = {
  activeGenre: string | null;
  setActiveGenre: (id: string) => void;
};

// Wild multi-stop gradients for each genre
const genreGradients: Record<string, string> = {
  "hip-hop": "from-[#FF00FF] via-[#FFFF00] via-[#00CCFF] via-[#FF6600] to-[#00FF00]",
  "electronic": "from-[#0A0A2A] via-[#6600FF] via-[#00FFFF] via-[#FF00CC] to-[#00FF99]",
  "rap": "from-[#333333] via-[#FF6600] via-[#FFCC00] via-[#FF0099] to-[#00FFCC]",
  "rnb": "from-[#4A0033] via-[#800040] via-[#FF99CC] via-[#FFD700] to-[#00CFFF]",
  "indie": "from-[#6B7A8F] via-[#A7C7E7] via-[#FFDDC1] via-[#E6E6FA] to-[#22223B]",
  "ambient": "from-[#0D0D1A] via-[#330066] via-[#66FFFF] via-[#B2FEFA] to-[#1A2980]",
  "jazz": "from-[#1A1A1A] via-[#4F4F4F] via-[#B28B00] via-[#FFD700] to-[#FF6F00]",
  "rock": "from-[#330000] via-[#CC0000] via-[#FF9900] via-[#FF00CC] to-[#00FF00]",
  "lofi": "from-[#A0522D] via-[#E0BBE4] via-[#957DAD] via-[#22223B] to-[#FFB347]",
  "experimental": "from-[#FF0000] via-[#00FF00] via-[#0000FF] via-[#FFFF00] to-[#FF00FF]",
};

// Genre-specific overlays (SVGs, blobs, etc)
const genreOverlays: Record<string, JSX.Element> = {
  "hip-hop": (
    <>
      <img
        src="/graffiti-splat.svg"
        className="absolute left-10 top-10 w-32 opacity-50 animate-bounce pointer-events-none"
        alt="Graffiti Splat"
      />
      <div className="absolute right-20 bottom-20 w-40 h-40 bg-[#FF00FF]/30 rounded-full blur-2xl animate-pulse-slow pointer-events-none" />
    </>
  ),
  "electronic": (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 animate-spin-slow" viewBox="0 0 800 600">
        <defs>
          <radialGradient id="neon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6600FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="400" cy="300" r="250" fill="url(#neon)" />
      </svg>
      <div className="absolute left-1/3 top-1/4 w-60 h-60 bg-[#00FFFF]/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
    </>
  ),
  "rap": (
    <>
      <div className="absolute left-1/4 top-1/2 w-48 h-48 bg-[#FF6600]/30 rounded-full blur-2xl animate-bounce pointer-events-none" />
      <div className="absolute right-1/4 bottom-1/4 w-32 h-32 bg-[#FFCC00]/30 rounded-full blur-2xl animate-pulse-slow pointer-events-none" />
    </>
  ),
  "rnb": (
    <>
      <div className="absolute left-1/2 top-1/3 w-56 h-56 bg-[#FF99CC]/30 rounded-full blur-2xl animate-pulse-slow pointer-events-none" />
      <div className="absolute right-1/3 bottom-1/4 w-40 h-40 bg-[#FFD700]/20 rounded-full blur-2xl animate-bounce pointer-events-none" />
    </>
  ),
  "indie": (
    <>
      <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-[#A7C7E7]/30 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute right-1/4 bottom-1/3 w-40 h-40 bg-[#FFDDC1]/20 rounded-full blur-2xl animate-bounce pointer-events-none" />
    </>
  ),
  "ambient": (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 animate-pulse-slow" viewBox="0 0 800 600">
        <defs>
          <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#66FFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#330066" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="400" cy="300" rx="300" ry="200" fill="url(#nebula)" />
      </svg>
      <div className="absolute left-1/3 top-1/2 w-72 h-72 bg-[#B2FEFA]/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
    </>
  ),
  "jazz": (
    <>
      <svg className="absolute left-1/2 top-1/4 w-32 h-32 pointer-events-none animate-bounce" viewBox="0 0 100 100">
        <text x="10" y="60" fontSize="60" fill="#FFD700" opacity="0.4" fontFamily="serif">♩</text>
      </svg>
      <div className="absolute left-1/3 bottom-1/3 w-40 h-40 bg-[#B28B00]/30 rounded-full blur-2xl animate-pulse-slow pointer-events-none" />
    </>
  ),
  "rock": (
    <>
      <svg className="absolute right-10 top-10 w-24 h-24 pointer-events-none animate-pulse-slow" viewBox="0 0 100 100">
        <polygon points="50,15 61,85 95,35 5,35 39,85" fill="#FF9900" opacity="0.3" />
      </svg>
      <div className="absolute left-1/4 bottom-1/4 w-56 h-56 bg-[#CC0000]/30 rounded-full blur-2xl animate-bounce pointer-events-none" />
    </>
  ),
  "lofi": (
    <>
      <img
        src="/cassette-tape.svg"
        className="absolute right-10 bottom-10 w-28 opacity-40 animate-bounce pointer-events-none"
        alt="Cassette Tape"
      />
      <div className="absolute left-1/3 top-1/3 w-44 h-44 bg-[#E0BBE4]/30 rounded-full blur-2xl animate-pulse-slow pointer-events-none" />
    </>
  ),
  "experimental": (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 animate-spin-slow">
        <filter id="glitch" x="0" y="0">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" result="turb"/>
          <feDisplacementMap in2="turb" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <rect width="100%" height="100%" fill="transparent" filter="url(#glitch)" />
      </svg>
      <div className="absolute left-1/2 top-1/2 w-64 h-64 bg-[#FF00FF]/20 rounded-full blur-3xl animate-bounce pointer-events-none" />
      <div className="absolute right-1/3 bottom-1/3 w-40 h-40 bg-[#00FF00]/20 rounded-full blur-2xl animate-pulse-slow pointer-events-none" />
    </>
  ),
};

const GenreStations = ({ activeGenre, setActiveGenre }: Props) => {
  const { playItem, nowPlayingInfo, isPlaying, setActiveGenreForTheme, pauseAllAudio, togglePlayPause } = useAudioStore();
  const [playingStationId, setPlayingStationId] = useState<string | null>(null);

  // Defensive fallback if genres are missing
  const currentGenreToDisplay = genreStations.find((g) => g.id === activeGenre) || genreStations[0] || null;
  if (!currentGenreToDisplay) {
    return <div className="p-10 text-red-500 font-bold">No genres available. Please check your data.</div>;
  }

  const avgHex = getAverageGradientHex(currentGenreToDisplay.color);
  const textClass = getContrastYIQ(avgHex);

  // Synchronize UI highlight with global state
  useEffect(() => {
    if (nowPlayingInfo?.type === 'station' && isPlaying && nowPlayingInfo.id.startsWith('station_')) {
      setPlayingStationId(nowPlayingInfo.id.replace('station_', ''));
    } else {
      setPlayingStationId(null);
    }
  }, [nowPlayingInfo, isPlaying]);

  const handleStationPlay = (station: any, genreId: string, stationGenreTag: string) => {
    if (!station.src) {
      console.warn(`Station "${station.name}" has no src defined.`);
      return;
    }
    const isCurrentStation = nowPlayingInfo?.id === `station_${station.id}`;
    const isPlayingThisStation = isCurrentStation && isPlaying;

    if (isPlayingThisStation) {
      pauseAllAudio();
    } else if (isCurrentStation && !isPlaying) {
      togglePlayPause();
    } else {
      const itemToPlay: NowPlayingInfo = {
        id: `station_${station.id}`,
        type: 'station',
        src: station.src,
        title: station.name,
        artistOrContext: currentGenreToDisplay.name,
        genre: genreId,
      };
      playItem(itemToPlay);
      setActiveGenreForTheme(genreId);
    }
  };

  // Map genre to overlays
  const genreOverlays: Record<string, JSX.Element> = {
    "hip-hop": (
      <img
        src="/graffiti-splat.svg"
        className="absolute left-10 top-10 w-32 opacity-40 animate-bounce pointer-events-none"
        alt="Graffiti Splat"
      />
    ),
    "ambient": (
      <div className="absolute right-10 bottom-10 w-48 h-48 bg-blue-300/30 rounded-full blur-2xl animate-pulse pointer-events-none" />
    ),
    "jazz": (
      <div className="absolute left-1/2 top-1/4 w-32 h-32 bg-yellow-700/30 rounded-full blur-2xl animate-pulse pointer-events-none" />
    ),
    "rock": (
      <div className="absolute left-10 bottom-10 w-40 h-40 bg-orange-600/30 rounded-full blur-2xl animate-pulse pointer-events-none" />
    ),
    "lofi": (
      <div className="absolute right-1/3 top-1/2 w-32 h-32 bg-purple-400/30 rounded-full blur-2xl animate-pulse pointer-events-none" />
    ),
    "indie": (
      <div className="absolute left-1/4 bottom-1/3 w-40 h-40 bg-pink-200/30 rounded-full blur-2xl animate-pulse pointer-events-none" />
    ),
    "electronic": (
      <div className="absolute right-1/4 top-1/4 w-48 h-48 bg-cyan-400/30 rounded-full blur-2xl animate-pulse pointer-events-none" />
    ),
    "experimental": (
      <div className="absolute left-1/3 top-1/3 w-36 h-36 bg-green-400/30 rounded-full blur-2xl animate-pulse pointer-events-none" />
    ),
    // ...add more overlays for other genres as desired
  };

  // Memoize overlay for performance
  const overlay = useMemo(
    () => genreOverlays[currentGenreToDisplay.id] || null,
    [currentGenreToDisplay.id]
  );

  return (
    <section className="relative flex w-full min-h-[700px] max-w-7xl mx-auto rounded-xl overflow-hidden shadow-2xl my-12 bg-gradient-to-br from-[#181c32] to-[#161927]/90">
      {/* Spicy animated gradient background */}
      <div className={`absolute inset-0 spicy-bg bg-gradient-to-br ${currentGenreToDisplay.color} z-[-1]`} />
      {/* Animated blobs for extra depth */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-pulse left-1/4 top-1/3"></div>
        <div className="absolute w-80 h-80 bg-cyan-400/20 rounded-full blur-2xl animate-pulse right-1/4 bottom-1/4"></div>
      </div>
      {/* Genre-specific overlay */}
      {overlay}
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-gradient-to-b from-[#0e1125]/80 to-[#191b26]/80 border-r border-blue-900/60 p-6">
        <h2 className={`text-2xl font-extrabold mb-4 tracking-wide ${textClass}`}>Genres</h2>
        <nav className="flex flex-col gap-2">
          {genreStations.map((genre) => (
            <button
              key={genre.id}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg text-left transition-all font-semibold
                ${activeGenre === genre.id
                  ? `bg-gradient-to-r ${genre.color} text-white shadow-lg`
                  : `${genreColors[genre.id as keyof typeof genreColors]?.text || genreColors["default"].text} hover:bg-gray-800/60`
                }`
              }
              onClick={() => setActiveGenre(genre.id)}
            >
              <Radio className="w-4 h-4" />
              {genre.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-10">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-fit z-10">
            <div className="absolute inset-0 bg-black/30 rounded-lg blur-[1.5px] pointer-events-none -z-10" />
            <h1 className={`font-black text-5xl ${textClass}`}>
              {currentGenreToDisplay.name} VIBES
            </h1>
            <p className={`mt-4 text-xl ${textClass}`}>
              {currentGenreToDisplay.description}
            </p>
          </div>
          <Badge className={`bg-gradient-to-r ${currentGenreToDisplay.color} text-white shadow-md`}>
            <Disc className="w-4 h-4 mr-2" />
            {currentGenreToDisplay.stations.filter((s) => s.isLive).length} Live
          </Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {currentGenreToDisplay.stations.map((station) => {
            const isCurrentStation = nowPlayingInfo?.id === `station_${station.id}`;
            const isPlayingThisStation = isCurrentStation && isPlaying;
            return (
              <Card
                key={station.id}
                className={`relative border-2 
                  ${playingStationId === station.id && isPlaying
                    ? "border-pink-400 shadow-[0_0_24px_4px_rgba(244,114,182,0.7)]"
                    : "border-cyan-500/40 shadow-[0_0_12px_2px_rgba(34,211,238,0.17)]"
                  }
                  bg-gray-900/70 hover:bg-gray-800/80 hover:border-white/80 transition-all duration-300 group overflow-hidden
                `}
              >
                <div className="absolute inset-0 bg-black/40 pointer-events-none rounded-lg" />
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${currentGenreToDisplay.color} flex items-center justify-center mr-4 shadow-md`}>
                      {playingStationId === station.id && isPlaying ? (
                        <Volume2 className="w-6 h-6 text-white animate-pulse" />
                      ) : (
                        <Radio className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${textClass}`}>{station.name}</h4>
                      <div className="flex items-center text-sm">
                        <span className={textClass}>{station.listeners} listening</span>
                        {station.isLive && (
                          <Badge className="ml-2 bg-red-600/20 text-red-400 border-red-500/30 px-2 py-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse inline-block"></span>
                            LIVE
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStationPlay(station, currentGenreToDisplay.id, station.genreTag)}
                    size="sm"
                    className={`rounded-full shadow-md
                      ${isPlayingThisStation
                        ? "bg-white text-black hover:bg-gray-200"
                        : `bg-gradient-to-r ${currentGenreToDisplay.color} text-white hover:opacity-90`
                      }
                    `}
                  >
                    {isPlayingThisStation
                      ? <PauseCircle className="w-5 h-5 mr-1" />
                      : <PlayCircle className="w-5 h-5 mr-1" />}
                    {isPlayingThisStation ? "Pause" : "Play"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GenreStations;
