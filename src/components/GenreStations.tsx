// src/components/GenreStations.tsx
import { useState } from "react";
import { Disc, Radio, PlayCircle, PauseCircle, Volume2 } from "lucide-react"; // Assuming Volume2 is used for playing state
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAudioStore, NowPlayingInfo } from "@/stores/audioStore";

// --- GENRE COLORS (assuming this structure is still desired) ---
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

// --- UPDATED GENRE DATA WITH CORRECTED SRC PATHS ---
const genreStations = [
  {
    id: "hip-hop", // Matches folder name
    name: "Hip Hop",
    color: "from-yellow-600 to-amber-600",
    description: "Fresh beats and lyrical mastery from underground to mainstream",
    stations: [
      { id: "hh1", name: "Urban Beats", src: "/audio/stations/hip-hop/urban_beats.mp3", genreTag: "Hip Hop", listeners: 238, isLive: true },
      { id: "hh2", name: "Lyrical Flow", src: "/audio/stations/hip-hop/lyrical_flow.mp3", genreTag: "Hip Hop", listeners: 174, isLive: false },
      { id: "hh3", name: "Classic Hip Hop", src: "/audio/stations/hip-hop/classic_hip_hop.mp3", genreTag: "Hip Hop", listeners: 202, isLive: true },
      { id: "hh4", name: "Trap Nation", src: "/audio/stations/hip-hop/trap_nation.mp3", genreTag: "Hip Hop", listeners: 312, isLive: true },
    ]
  },
  {
    id: "electronic", // Matches folder name
    name: "Electronic",
    color: "from-blue-600 to-cyan-600",
    description: "Cutting-edge electronic soundscapes and digital innovations",
    stations: [
      { id: "el1", name: "Future Bass", src: "/audio/stations/electronic/future_bass.mp3", genreTag: "Electronic", listeners: 189, isLive: true },
      { id: "el2", name: "Deep House", src: "/audio/stations/electronic/deep_house.mp3", genreTag: "Electronic", listeners: 246, isLive: true },
      { id: "el3", name: "Techno Lab", src: "/audio/stations/electronic/techno_lab.mp3", genreTag: "Electronic", listeners: 158, isLive: false },
      { id: "el4", name: "EDM Central", src: "/audio/stations/electronic/edm_central.mp3", genreTag: "Electronic", listeners: 298, isLive: true },
    ]
  },
  {
    id: "rap", // Matches folder name
    name: "Rap",
    color: "from-purple-600 to-indigo-600",
    description: "Raw energy and authentic stories from the streets to the charts",
    stations: [
      { id: "rp1", name: "Rap Caviar", src: "/audio/stations/rap/rap_caviar.mp3", genreTag: "Rap", listeners: 267, isLive: true },
      { id: "rp2", name: "Bars & Verses", src: "/audio/stations/rap/bars_and_verses.mp3", genreTag: "Rap", listeners: 183, isLive: false },
      { id: "rp3", name: "Trap Beats", src: "/audio/stations/rap/trap_beats.mp3", genreTag: "Rap", listeners: 219, isLive: true },
      { id: "rp4", name: "Freestyle Lab", src: "/audio/stations/rap/freestyle_lab.mp3", genreTag: "Rap", listeners: 156, isLive: true },
    ]
  },
  {
    id: "rnb", // Matches folder name
    name: "R&B",
    color: "from-rose-600 to-pink-600",
    description: "Smooth rhythms and soulful melodies that touch the heart",
    stations: [
      { id: "rb1", name: "Soul Sessions", src: "/audio/stations/rnb/soul_sessions.mp3", genreTag: "R&B", listeners: 176, isLive: true },
      { id: "rb2", name: "Modern R&B", src: "/audio/stations/rnb/modern_rnb.mp3", genreTag: "R&B", listeners: 203, isLive: true },
      { id: "rb3", name: "R&B Classics", src: "/audio/stations/rnb/rnb_classics.mp3", genreTag: "R&B", listeners: 184, isLive: false },
      { id: "rb4", name: "Slow Jams", src: "/audio/stations/rnb/slow_jams.mp3", genreTag: "R&B", listeners: 142, isLive: true },
    ]
  },
  {
    id: "indie", // Matches folder name
    name: "Indie",
    color: "from-green-600 to-emerald-600",
    description: "Authentic sounds from independent artists pushing boundaries",
    stations: [
      { id: "in1", name: "Indie Discoveries", src: "/audio/stations/indie/indie_discoveries.mp3", genreTag: "Indie", listeners: 164, isLive: true },
      { id: "in2", name: "Alternative Waves", src: "/audio/stations/indie/alternative_waves.mp3", genreTag: "Indie", listeners: 149, isLive: false },
      { id: "in3", name: "Indie Pop", src: "/audio/stations/indie/indie_pop.mp3", genreTag: "Indie", listeners: 187, isLive: true },
      { id: "in4", name: "Lo-Fi Beats Station", src: "/audio/stations/indie/lofi_beats_station.mp3", genreTag: "Indie", listeners: 221, isLive: true }, // Note: file is lofi_beats_station.mp3 in indie folder
    ]
  },
  {
    id: "ambient", // Matches folder name
    name: "Ambient",
    color: "from-teal-600 to-sky-600",
    description: "Atmospheric soundscapes for focus, relaxation and inspiration",
    stations: [
      { id: "am1", name: "Chill Atmospheres", src: "/audio/stations/ambient/chill_atmospheres.mp3", genreTag: "Ambient", listeners: 198, isLive: true },
      { id: "am2", name: "Focus Flow", src: "/audio/stations/ambient/focus_flow.mp3", genreTag: "Ambient", listeners: 226, isLive: true },
      { id: "am3", name: "Sleep Sounds", src: "/audio/stations/ambient/sleep_sounds.mp3", genreTag: "Ambient", listeners: 174, isLive: false },
      { id: "am4", name: "Ambient Worlds", src: "/audio/stations/ambient/ambient_worlds.mp3", genreTag: "Ambient", listeners: 163, isLive: true },
    ]
  },
  {
    id: "jazz", // Matches folder name
    name: "Jazz",
    color: "from-amber-600 to-orange-600",
    description: "Timeless improvisations and sophisticated harmonies",
    stations: [
      { id: "jz1", name: "Jazz Classics", src: "/audio/stations/jazz/jazz_classics.mp3", genreTag: "Jazz", listeners: 148, isLive: true },
      { id: "jz2", name: "Modern Jazz", src: "/audio/stations/jazz/modern_jazz.mp3", genreTag: "Jazz", listeners: 132, isLive: false },
      { id: "jz3", name: "Fusion Lab", src: "/audio/stations/jazz/fusion_lab.mp3", genreTag: "Jazz", listeners: 126, isLive: true },
      { id: "jz4", name: "Late Night Jazz", src: "/audio/stations/jazz/late_night_jazz.mp3", genreTag: "Jazz", listeners: 157, isLive: true },
    ]
  },
  {
    id: "rock", // Matches folder name
    name: "Rock",
    color: "from-red-600 to-rose-600",
    description: "Powerful riffs and raw energy from classic to contemporary",
    stations: [
      { id: "rk1", name: "Classic Rock", src: "/audio/stations/rock/classic_rock.mp3", genreTag: "Rock", listeners: 213, isLive: true },
      { id: "rk2", name: "Alternative Rock", src: "/audio/stations/rock/alternative_rock.mp3", genreTag: "Rock", listeners: 187, isLive: true },
      { id: "rk3", name: "Indie Rock Station", src: "/audio/stations/rock/indie_rock_station.mp3", genreTag: "Rock", listeners: 154, isLive: false }, // Note: file is indie_rock_station.mp3
      { id: "rk4", name: "Hard Rock", src: "/audio/stations/rock/hard_rock.mp3", genreTag: "Rock", listeners: 176, isLive: true },
    ]
  },
  {
    id: "lofi", // Matches folder name, tree uses "lofi"
    name: "Lo-Fi", // Display name
    color: "from-violet-600 to-purple-600",
    description: "Mellow beats perfect for relaxation, study and chill vibes",
    stations: [
      { id: "lf1", name: "Lo-Fi Study", src: "/audio/stations/lofi/lofi_study.mp3", genreTag: "Lo-Fi", listeners: 284, isLive: true },
      { id: "lf2", name: "Chill Hop", src: "/audio/stations/lofi/chill_hop.mp3", genreTag: "Lo-Fi", listeners: 246, isLive: true },
      { id: "lf3", name: "Jazzy Beats", src: "/audio/stations/lofi/jazzy_beats.mp3", genreTag: "Lo-Fi", listeners: 193, isLive: false },
      { id: "lf4", name: "Sleepy Lofi", src: "/audio/stations/lofi/sleepy_lofi.mp3", genreTag: "Lo-Fi", listeners: 218, isLive: true },
    ]
  },
  {
    id: "experimental", // Matches folder name
    name: "Experimental",
    color: "from-fuchsia-600 to-violet-600",
    description: "Boundary-pushing sounds that defy conventional genres",
    stations: [
      { id: "ex1", name: "Sound Design", src: "/audio/stations/experimental/sound_design.mp3", genreTag: "Experimental", listeners: 129, isLive: true },
      { id: "ex2", name: "Avant-Garde", src: "/audio/stations/experimental/avant_garde.mp3", genreTag: "Experimental", listeners: 112, isLive: false },
      { id: "ex3", name: "Glitch Lab", src: "/audio/stations/experimental/glitch_lab.mp3", genreTag: "Experimental", listeners: 134, isLive: true },
      { id: "ex4", name: "Future Sounds", src: "/audio/stations/experimental/future_sounds.mp3", genreTag: "Experimental", listeners: 156, isLive: true },
    ]
  }
];

type Props = {
  activeGenre: string | null;
  setActiveGenre: (id: string) => void;
};

const GenreStations = ({ activeGenre, setActiveGenre }: Props) => {
  const { playItem, nowPlayingInfo, isPlaying, setActiveGenreForTheme } = useAudioStore(); // Removed activeGenreForTheme as it's set via setActiveGenre
  const [playingStationId, setPlayingStationId] = useState<string | null>(null);


  // Determine the current genre object to display, defaulting to the first if activeGenre is null
  const currentGenreToDisplay = genreStations.find((g) => g.id === activeGenre) || genreStations[0];
  const genreTextClass = genreColors[currentGenreToDisplay.id as keyof typeof genreColors]?.text || genreColors["default"].text;


  const handleStationPlay = (station: any, genreId: string, stationGenreTag: string) => {
    if (!station.src) {
      console.warn(`Station "${station.name}" has no src defined.`);
      // Optionally: toast({ title: "Station Unavailable", description: `"${station.name}" is not ready yet.`});
      return;
    }

    const isCurrentlyPlayingThisStation = nowPlayingInfo?.id === `station_${station.id}` && isPlaying;

    if (isCurrentlyPlayingThisStation) {
      useAudioStore.getState().pauseAllAudio();
      setPlayingStationId(null);
      // No theme change on pause from here, keep current theme. Full stop via stopPlayback would reset.
    } else {
      const itemToPlay: NowPlayingInfo = {
        id: `station_${station.id}`,
        type: 'station',
        src: station.src,
        title: station.name,
        artistOrContext: currentGenreToDisplay.name,
        genre: genreId, // **** CRITICAL: Use genreId (e.g., "hip-hop") for theming ****
      };
      playItem(itemToPlay); // This will also call setActiveGenreForTheme(genreId) inside playItem
      setPlayingStationId(station.id);
      // setActiveGenreForTheme(genreId); // Redundant if playItem sets it, but can be left for explicitness if needed
      useAudioStore.getState().setActiveGenreForTheme(genreId);
    }
  };
  
  // Effect to sync playingStationId with global store, e.g., if playback stops from elsewhere
  useState(() => {
    const unsubscribe = useAudioStore.subscribe(
      (state) => state.nowPlayingInfo,
      (newNowPlayingInfo, oldNowPlayingInfo) => {
        if (!newNowPlayingInfo || newNowPlayingInfo.type !== 'station' || !isPlaying) {
          setPlayingStationId(null);
        } else if (newNowPlayingInfo.type === 'station' && isPlaying) {
          const stationId = newNowPlayingInfo.id.replace('station_', '');
          setPlayingStationId(stationId);
        }
      }
    );
    return unsubscribe;
  }, [isPlaying]);


  return (
    <section className="relative flex w-full min-h-[700px] max-w-7xl mx-auto rounded-xl overflow-hidden shadow-2xl my-12 bg-gradient-to-br from-[#181c32] to-[#161927]/90">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-gradient-to-b from-[#0e1125]/80 to-[#191b26]/80 border-r border-blue-900/60 p-6">
        <h2 className={`text-2xl font-extrabold mb-4 tracking-wide ${genreColors[currentGenreToDisplay.id as keyof typeof genreColors]?.text || genreColors["default"].text}`}>Genres</h2>
        <nav className="flex flex-col gap-2">
          {genreStations.map((genre) => (
            <button
              key={genre.id}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg text-left transition-all font-semibold
                ${activeGenre === genre.id
                  ? `bg-gradient-to-r ${genre.color} text-white shadow-lg`
                  : `${genreColors[genre.id as keyof typeof genreColors]?.text || genreColors["default"].text} hover:bg-gray-800/60`}
              `}
              onClick={() => {
                setActiveGenre(genre.id); // Local state for displaying stations
                // setActiveGenreForTheme(genre.id); // Update theme when genre is selected in sidebar - already handled by playItem
              }}
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
            <h3 className={`text-3xl font-black bg-gradient-to-r ${currentGenreToDisplay.color} bg-clip-text text-transparent`}>
              {currentGenreToDisplay.name} Stations
            </h3>
            <p className={`mt-2 text-lg ${genreTextClass}`}>{currentGenreToDisplay.description}</p>
          </div>
          <Badge className={`bg-gradient-to-r ${currentGenreToDisplay.color} text-white shadow-md`}>
            <Disc className="w-4 h-4 mr-2" />
            {currentGenreToDisplay.stations.filter((s) => s.isLive).length} Live
          </Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {currentGenreToDisplay.stations.map((station) => (
            <Card
              key={station.id}
              className={`relative border-2 
                ${playingStationId === station.id && isPlaying // Check global isPlaying state too
                  ? `border-pink-400 shadow-[0_0_24px_4px_rgba(244,114,182,0.7)]`
                  : "border-cyan-500/40 shadow-[0_0_12px_2px_rgba(34,211,238,0.17)]"}
                bg-gray-900/70 hover:bg-gray-800/80 hover:border-white/80 transition-all duration-300 group overflow-hidden
              `}
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${currentGenreToDisplay.color} flex items-center justify-center mr-4 shadow-md`}>
                    {playingStationId === station.id && isPlaying ? ( // Check global isPlaying
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
                  onClick={() => handleStationPlay(station, currentGenreToDisplay.id, station.genreTag)}
                  size="sm"
                  className={`rounded-full shadow-md
                    ${playingStationId === station.id && isPlaying // Check global isPlaying
                      ? 'bg-white text-black hover:bg-gray-200' // Pause button style
                      : `bg-gradient-to-r ${currentGenreToDisplay.color} text-white hover:opacity-90`} // Play button style
                  `}
                >
                  {playingStationId === station.id && isPlaying ? ( // Check global isPlaying
                    <PauseCircle className="w-5 h-5 mr-1" />
                  ) : (
                    <PlayCircle className="w-5 h-5 mr-1" />
                  )}
                  {playingStationId === station.id && isPlaying ? 'Pause' : 'Play'}
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