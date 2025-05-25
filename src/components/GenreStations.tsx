import { useState } from "react";
import { Disc, Radio, PlayCircle, PauseCircle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// --- 1. GENRE COLORS FOR AUTO TEXT CONTRAST ---
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

// --- 2. GENRE DATA ---
const genreStations = [
  {
    id: "hip-hop",
    name: "Hip Hop",
    color: "from-yellow-600 to-amber-600",
    description: "Fresh beats and lyrical mastery from underground to mainstream",
    stations: [
      { id: "hh1", name: "Urban Beats", listeners: 238, isLive: true },
      { id: "hh2", name: "Lyrical Flow", listeners: 174, isLive: false },
      { id: "hh3", name: "Classic Hip Hop", listeners: 202, isLive: true },
      { id: "hh4", name: "Trap Nation", listeners: 312, isLive: true },
    ]
  },
  {
    id: "electronic",
    name: "Electronic",
    color: "from-blue-600 to-cyan-600",
    description: "Cutting-edge electronic soundscapes and digital innovations",
    stations: [
      { id: "el1", name: "Future Bass", listeners: 189, isLive: true },
      { id: "el2", name: "Deep House", listeners: 246, isLive: true },
      { id: "el3", name: "Techno Lab", listeners: 158, isLive: false },
      { id: "el4", name: "EDM Central", listeners: 298, isLive: true },
    ]
  },
  {
    id: "rap",
    name: "Rap",
    color: "from-purple-600 to-indigo-600",
    description: "Raw energy and authentic stories from the streets to the charts",
    stations: [
      { id: "rp1", name: "Rap Caviar", listeners: 267, isLive: true },
      { id: "rp2", name: "Bars & Verses", listeners: 183, isLive: false },
      { id: "rp3", name: "Trap Beats", listeners: 219, isLive: true },
      { id: "rp4", name: "Freestyle Lab", listeners: 156, isLive: true },
    ]
  },
  {
    id: "rnb",
    name: "R&B",
    color: "from-rose-600 to-pink-600",
    description: "Smooth rhythms and soulful melodies that touch the heart",
    stations: [
      { id: "rb1", name: "Soul Sessions", listeners: 176, isLive: true },
      { id: "rb2", name: "Modern R&B", listeners: 203, isLive: true },
      { id: "rb3", name: "R&B Classics", listeners: 184, isLive: false },
      { id: "rb4", name: "Slow Jams", listeners: 142, isLive: true },
    ]
  },
  {
    id: "indie",
    name: "Indie",
    color: "from-green-600 to-emerald-600",
    description: "Authentic sounds from independent artists pushing boundaries",
    stations: [
      { id: "in1", name: "Indie Discoveries", listeners: 164, isLive: true },
      { id: "in2", name: "Alternative Waves", listeners: 149, isLive: false },
      { id: "in3", name: "Indie Pop", listeners: 187, isLive: true },
      { id: "in4", name: "Lo-Fi Beats", listeners: 221, isLive: true },
    ]
  },
  {
    id: "ambient",
    name: "Ambient",
    color: "from-teal-600 to-sky-600",
    description: "Atmospheric soundscapes for focus, relaxation and inspiration",
    stations: [
      { id: "am1", name: "Chill Atmospheres", listeners: 198, isLive: true },
      { id: "am2", name: "Focus Flow", listeners: 226, isLive: true },
      { id: "am3", name: "Sleep Sounds", listeners: 174, isLive: false },
      { id: "am4", name: "Ambient Worlds", listeners: 163, isLive: true },
    ]
  },
  {
    id: "jazz",
    name: "Jazz",
    color: "from-amber-600 to-orange-600",
    description: "Timeless improvisations and sophisticated harmonies",
    stations: [
      { id: "jz1", name: "Jazz Classics", listeners: 148, isLive: true },
      { id: "jz2", name: "Modern Jazz", listeners: 132, isLive: false },
      { id: "jz3", name: "Fusion Lab", listeners: 126, isLive: true },
      { id: "jz4", name: "Late Night Jazz", listeners: 157, isLive: true },
    ]
  },
  {
    id: "rock",
    name: "Rock",
    color: "from-red-600 to-rose-600",
    description: "Powerful riffs and raw energy from classic to contemporary",
    stations: [
      { id: "rk1", name: "Classic Rock", listeners: 213, isLive: true },
      { id: "rk2", name: "Alternative Rock", listeners: 187, isLive: true },
      { id: "rk3", name: "Indie Rock", listeners: 154, isLive: false },
      { id: "rk4", name: "Hard Rock", listeners: 176, isLive: true },
    ]
  },
  {
    id: "lofi",
    name: "Lo-Fi",
    color: "from-violet-600 to-purple-600",
    description: "Mellow beats perfect for relaxation, study and chill vibes",
    stations: [
      { id: "lf1", name: "Lo-Fi Study", listeners: 284, isLive: true },
      { id: "lf2", name: "Chill Hop", listeners: 246, isLive: true },
      { id: "lf3", name: "Jazzy Beats", listeners: 193, isLive: false },
      { id: "lf4", name: "Sleepy Lofi", listeners: 218, isLive: true },
    ]
  },
  {
    id: "experimental",
    name: "Experimental",
    color: "from-fuchsia-600 to-violet-600",
    description: "Boundary-pushing sounds that defy conventional genres",
    stations: [
      { id: "ex1", name: "Sound Design", listeners: 129, isLive: true },
      { id: "ex2", name: "Avant-Garde", listeners: 112, isLive: false },
      { id: "ex3", name: "Glitch Lab", listeners: 134, isLive: true },
      { id: "ex4", name: "Future Sounds", listeners: 156, isLive: true },
    ]
  }
];

// --- 3. PROPS ---
type Props = {
  activeGenre: string | null;
  setActiveGenre: (id: string) => void;
};

const GenreStations = ({ activeGenre, setActiveGenre }: Props) => {
  const [playingStation, setPlayingStation] = useState<string | null>(null);

  // 4. Get current genre and text color
  const currentGenre = genreStations.find((g) => g.id === activeGenre) || genreStations[0];
  const genreTextClass = genreColors[activeGenre || "default"].text;

  const handleStationPlay = (stationId: string) => {
    setPlayingStation(playingStation === stationId ? null : stationId);
  };

  return (
    <section className="relative flex w-full min-h-[700px] max-w-7xl mx-auto rounded-xl overflow-hidden shadow-2xl my-12 bg-gradient-to-br from-[#181c32] to-[#161927]/90">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-gradient-to-b from-[#0e1125]/80 to-[#191b26]/80 border-r border-blue-900/60 p-6">
        <h2 className={`text-2xl font-extrabold mb-4 tracking-wide ${genreTextClass}`}>Genres</h2>
        <nav className="flex flex-col gap-2">
          {genreStations.map((genre) => (
            <button
              key={genre.id}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg text-left transition-all font-semibold
                ${activeGenre === genre.id
                  ? `bg-gradient-to-r ${genre.color} text-white shadow-lg`
                  : `${genreTextClass} hover:bg-gray-800/60`}
              `}
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
          <div>
            <h3 className={`text-3xl font-black bg-gradient-to-r ${currentGenre.color} bg-clip-text text-transparent ${genreTextClass}`}>
              {currentGenre.name} Stations
            </h3>
            <p className={`mt-2 text-lg ${genreTextClass}`}>{currentGenre.description}</p>
          </div>
          <Badge className={`bg-gradient-to-r ${currentGenre.color} text-white shadow-md`}>
            <Disc className="w-4 h-4 mr-2" />
            {currentGenre.stations.filter((s) => s.isLive).length} Live
          </Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {currentGenre.stations.map((station) => (
            <Card
              key={station.id}
              className={`relative border-2 
                ${playingStation === station.id
                  ? `border-pink-400 shadow-[0_0_24px_4px_rgba(244,114,182,0.7)]`
                  : "border-cyan-500/40 shadow-[0_0_12px_2px_rgba(34,211,238,0.17)]"}
                bg-gray-900/70 hover:bg-gray-800/80 hover:border-white/80 transition-all duration-300 group overflow-hidden
              `}
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${currentGenre.color} flex items-center justify-center mr-4 shadow-md`}>
                    {playingStation === station.id ? (
                      <Volume2 className="w-6 h-6 text-white animate-pulse" />
                    ) : (
                      <Radio className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${genreTextClass}`}>{station.name}</h4>
                    <div className="flex items-center text-sm">
                      <span className={`${genreTextClass}`}>{station.listeners} listening</span>
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
                  onClick={() => handleStationPlay(station.id)}
                  size="sm"
                  className={`rounded-full shadow-md
                    ${playingStation === station.id
                      ? 'bg-white text-black hover:bg-gray-200'
                      : `bg-gradient-to-r ${currentGenre.color} text-white hover:opacity-90`}
                  `}
                >
                  {playingStation === station.id ? (
                    <PauseCircle className="w-5 h-5 mr-1" />
                  ) : (
                    <PlayCircle className="w-5 h-5 mr-1" />
                  )}
                  {playingStation === station.id ? 'Pause' : 'Play'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreStations;
