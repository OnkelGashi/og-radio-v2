import { useState, useEffect, useMemo } from "react";
import { Disc, Radio, PlayCircle, PauseCircle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAudioStore, NowPlayingInfo } from "@/stores/audioStore";
import { getContrastYIQ } from "@/utils/getContrastYIQ";
import { getAverageGradientHex } from "@/utils/colorUtils";
import { getDynamicTextClass } from "@/utils/textColors";
import { useUIStore } from "@/stores/uiStore";

// --- GENRE COLORS ---
const genreColors = {
  "hip-hop":    { background: "bg-hiphop",   text: "text-yellow-200" },
  electronic: { background: "bg-electronic", text: "text-cyan-100" },
  rap:        { background: "bg-rap",      text: "text-pink-100" },
  rnb:        { background: "bg-rnb",      text: "text-rose-50" },
  indie:      { background: "bg-indie",    text: "text-gray-100" },
  ambient:    { background: "bg-ambient",  text: "text-teal-50" },
  jazz:       { background: "bg-jazz",     text: "text-amber-100" },
  rock:       { background: "bg-rock",     text: "text-red-100" },
  lofi:       { background: "bg-lofi",     text: "text-indigo-100" },
  experimental: { background: "bg-experimental", text: "text-fuchsia-100" },
  default:    { background: "bg-default-og", text: "text-white" }
};

// --- GENRE DATA ---
export const genreStations = [
  {
    id: "pop",
    name: "Pop",
    color: "from-pink-400 via-pink-300 to-blue-400",
    description: "Modern, eingängig, tanzbar, mitreißend.",
    stations: [
      { id: "pop1", name: "Dance-Pop", genreTag: "Pop", listeners: 210, isLive: true, moods: ["energy", "uplifting"], src: "/audio/playlists/bass_chronicles.mp3" },
      { id: "pop2", name: "Synth-Pop", genreTag: "Pop", listeners: 180, isLive: false, moods: ["chill", "uplifting"], src: "/audio/playlists/ethereal_journeys.mp3" },
      { id: "pop3", name: "Pop Rock", genreTag: "Pop", listeners: 195, isLive: true, moods: ["energy"], src: "/audio/playlists/indie_futures_playlist.mp3" },
      { id: "pop4", name: "Indie Pop", genreTag: "Pop", listeners: 170, isLive: true, moods: ["chill", "uplifting"], src: "/audio/playlists/nocturnal_frequencies.mp3" },
    ]
  },
  {
    id: "hip-hop",
    name: "Hip Hop",
    color: "from-yellow-400 via-pink-500 to-indigo-500",
    description: "Urban, rhythmisch, lyrisch, innovativ.",
    stations: [
      { id: "hh1", name: "Gangsta Rap", genreTag: "Hip Hop", listeners: 238, isLive: true, moods: ["intense"], src: "/audio/picks/underground_pulse.mp3" },
      { id: "hh2", name: "Conscious Hip Hop", genreTag: "Hip Hop", listeners: 174, isLive: false, moods: ["uplifting"], src: "/audio/picks/digital_dreams.mp3" },
      { id: "hh3", name: "Trap", genreTag: "Hip Hop", listeners: 202, isLive: true, moods: ["energy", "intense"], src: "/audio/picks/balerina-capuchina.mp3" },
      { id: "hh4", name: "Boom Bap", genreTag: "Hip Hop", listeners: 312, isLive: true, moods: ["chill"], src: "/audio/picks/midnight_frequencies.mp3" },
    ]
  },
  {
    id: "indie",
    name: "Indie",
    color: "from-[#c7d2fe] via-[#64748b]/70 to-[#161927]/95",
    description: "Unabhängig, kreativ, experimentell, gefühlvoll.",
    stations: [
      { id: "in1", name: "Indie Rock", genreTag: "Indie", listeners: 164, isLive: true, moods: ["energy"], src: "/audio/playlists/indie_futures_playlist.mp3" },
      { id: "in2", name: "Indie Folk", genreTag: "Indie", listeners: 149, isLive: false, moods: ["chill"], src: "/audio/playlists/ethereal_journeys.mp3" },
      { id: "in3", name: "Dream Pop", genreTag: "Indie", listeners: 187, isLive: true, moods: ["atmospheric"], src: "/audio/playlists/nocturnal_frequencies.mp3" },
      { id: "in4", name: "Shoegaze", genreTag: "Indie", listeners: 221, isLive: true, moods: ["atmospheric", "chill"], src: "/audio/playlists/gaming_pulse.mp3" },
    ]
  },
  {
    id: "rnb",
    name: "R&B (Rhythm and Blues)",
    color: "from-pink-700/60 via-pink-400/40 to-purple-900/80",
    description: "Gefühlvoll, groovig, emotional, smooth.",
    stations: [
      { id: "rb1", name: "Contemporary R&B", genreTag: "R&B", listeners: 176, isLive: true, moods: ["chill", "uplifting"], src: "/audio/picks/digital_dreams.mp3" },
      { id: "rb2", name: "Neo-Soul", genreTag: "R&B", listeners: 203, isLive: true, moods: ["chill"], src: "/audio/picks/balerina-capuchina.mp3" },
      { id: "rb3", name: "Alternative R&B (PBR&B)", genreTag: "R&B", listeners: 184, isLive: false, moods: ["atmospheric"], src: "/audio/picks/underground_pulse.mp3" },
      { id: "rb4", name: "Quiet Storm", genreTag: "R&B", listeners: 142, isLive: true, moods: ["chill"], src: "/audio/picks/midnight_frequencies.mp3" },
    ]
  },
  {
    id: "edm",
    name: "Electronic Dance Music (EDM)",
    color: "from-[#06B6D4] via-[#818CF8] to-[#F472B6]",
    description: "Elektronisch, tanzbar, energetisch, modern.",
    stations: [
      { id: "el1", name: "House", genreTag: "EDM", listeners: 189, isLive: true, moods: ["energy"], src: "/audio/playlists/digital_underground.mp3" },
      { id: "el2", name: "Techno", genreTag: "EDM", listeners: 246, isLive: true, moods: ["intense"], src: "/audio/playlists/bass_chronicles.mp3" },
      { id: "el3", name: "Trance", genreTag: "EDM", listeners: 158, isLive: false, moods: ["uplifting", "atmospheric"], src: "/audio/playlists/ethereal_journeys.mp3" },
      { id: "el4", name: "Dubstep", genreTag: "EDM", listeners: 298, isLive: true, moods: ["intense"], src: "/audio/playlists/gaming_pulse.mp3" },
    ]
  },
  {
    id: "country",
    name: "Country",
    color: "from-yellow-200 via-orange-300 to-orange-700",
    description: "Traditionell, erzählerisch, herzlich, authentisch.",
    stations: [
      { id: "co1", name: "Traditional Country", genreTag: "Country", listeners: 120, isLive: true, moods: ["uplifting"], src: "/audio/default/faded-frequencies.mp3" },
      { id: "co2", name: "Country Pop (Contemporary Country)", genreTag: "Country", listeners: 98, isLive: false, moods: ["chill", "uplifting"], src: "/audio/default/faded-frequencies.mp3" },
      { id: "co3", name: "Outlaw Country", genreTag: "Country", listeners: 87, isLive: true, moods: ["intense"], src: "/audio/default/faded-frequencies.mp3" },
      { id: "co4", name: "Bluegrass", genreTag: "Country", listeners: 76, isLive: true, moods: ["energy"], src: "/audio/default/faded-frequencies.mp3" },
    ]
  },
  {
    id: "jazz",
    name: "Jazz",
    color: "from-amber-700/60 via-orange-400/40 to-orange-900/80",
    description: "Improvisiert, elegant, zeitlos, groovig.",
    stations: [
      { id: "jz1", name: "Swing", genreTag: "Jazz", listeners: 148, isLive: true, moods: ["uplifting"], src: "/audio/playlists/ethereal_journeys.mp3" },
      { id: "jz2", name: "Bebop", genreTag: "Jazz", listeners: 132, isLive: false, moods: ["intense"], src: "/audio/playlists/bass_chronicles.mp3" },
      { id: "jz3", name: "Cool Jazz", genreTag: "Jazz", listeners: 126, isLive: true, moods: ["chill"], src: "/audio/playlists/nocturnal_frequencies.mp3" },
      { id: "jz4", name: "Fusion (Jazz Fusion)", genreTag: "Jazz", listeners: 157, isLive: true, moods: ["experimental"], src: "/audio/playlists/gaming_pulse.mp3" },
    ]
  },
  {
    id: "reggae",
    name: "Reggae",
    color: "from-green-400 via-yellow-300 to-red-400",
    description: "Entspannt, rhythmisch, karibisch, positiv.",
    stations: [
      { id: "re1", name: "Roots Reggae", genreTag: "Reggae", listeners: 110, isLive: true, moods: ["chill"], src: "/audio/playlists/ethereal_journeys.mp3" },
      { id: "re2", name: "Dancehall", genreTag: "Reggae", listeners: 99, isLive: false, moods: ["energy"], src: "/audio/playlists/bass_chronicles.mp3" },
      { id: "re3", name: "Dub", genreTag: "Reggae", listeners: 88, isLive: true, moods: ["atmospheric"], src: "/audio/playlists/nocturnal_frequencies.mp3" },
      { id: "re4", name: "Lovers Rock", genreTag: "Reggae", listeners: 77, isLive: true, moods: ["uplifting"], src: "/audio/playlists/indie_futures_playlist.mp3" },
    ]
  },
  {
    id: "latin",
    name: "Latin",
    color: "from-red-400 via-yellow-200 to-green-400",
    description: "Lebendig, rhythmisch, tanzbar, leidenschaftlich.",
    stations: [
      { id: "la1", name: "Salsa", genreTag: "Latin", listeners: 130, isLive: true, moods: ["energy"], src: "/audio/playlists/bass_chronicles.mp3" },
      { id: "la2", name: "Reggaeton", genreTag: "Latin", listeners: 120, isLive: false, moods: ["intense"], src: "/audio/playlists/gaming_pulse.mp3" },
      { id: "la3", name: "Cumbia", genreTag: "Latin", listeners: 110, isLive: true, moods: ["uplifting"], src: "/audio/playlists/ethereal_journeys.mp3" },
      { id: "la4", name: "Bossa Nova", genreTag: "Latin", listeners: 100, isLive: true, moods: ["chill"], src: "/audio/playlists/nocturnal_frequencies.mp3" },
    ]
  },
  {
    id: "rap",
    name: "Rap",
    color: "from-[#FBBF24] via-[#F87171] to-[#1E293B]",
    description: "Lyrisch, ausdrucksstark, vielfältig, kreativ.",
    stations: [
      { id: "rp1", name: "Lyrical Rap", genreTag: "Rap", listeners: 267, isLive: true, moods: ["uplifting"], src: "/audio/picks/underground_pulse.mp3" },
      { id: "rp2", name: "Mumble Rap", genreTag: "Rap", listeners: 183, isLive: false, moods: ["chill"], src: "/audio/picks/balerina-capuchina.mp3" },
      { id: "rp3", name: "Chopper / Fast Rap", genreTag: "Rap", listeners: 219, isLive: true, moods: ["intense"], src: "/audio/picks/tung-tung-tung-tung-sahur.mp3" },
      { id: "rp4", name: "Storytelling Rap", genreTag: "Rap", listeners: 156, isLive: true, moods: ["atmospheric"], src: "/audio/picks/midnight_frequencies.mp3" },
    ]
  },
]; // <--- Make sure this closes the array!

// --- MOOD DATA ---
const moodOptions = [
  { id: "chill", name: "Chill", color: "from-blue-400 to-cyan-400" },
  { id: "energy", name: "Energy", color: "from-pink-500 to-yellow-400" },
  { id: "uplifting", name: "Uplifting", color: "from-green-400 to-yellow-300" },
  { id: "atmospheric", name: "Atmospheric", color: "from-indigo-400 to-purple-400" },
  { id: "intense", name: "Intense", color: "from-red-500 to-orange-500" },
];

type Props = {
  activeGenre: string | null;
  setActiveGenre: (id: string) => void;
};

const GenreStations = ({ activeGenre, setActiveGenre }: Props) => {
  const nightMode = useUIStore((s) => s.nightMode);
  const { playItem, nowPlayingInfo, isPlaying, setActiveGenreForTheme, pauseAllAudio, togglePlayPause } = useAudioStore();
  const [playingStationId, setPlayingStationId] = useState<string | null>(null);
  const [mode, setMode] = useState<'genre' | 'mood'>('genre');
  const [activeMood, setActiveMood] = useState<string | null>(null);

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

  // Filter stations by mood if in mood mode
  const moodStations = useMemo(() => {
    if (!activeMood) return [];
    // Flatten all stations and filter by mood (assuming each station has a moods array)
    return genreStations.flatMap(g => g.stations.map(s => ({ ...s, genre: g.id, moods: s.moods || [] })))
      .filter(station => station.moods && station.moods.includes(activeMood));
  }, [activeMood]);

  // Memoize overlay for performance
  const genreOverlays: Record<string, JSX.Element> = {
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

  const overlay = useMemo(
    () => genreOverlays[currentGenreToDisplay.id] || null,
    [currentGenreToDisplay.id]
  );

  return (
    <section className={`relative flex w-full min-h-[700px] max-w-7xl mx-auto rounded-xl overflow-hidden shadow-2xl my-12 ${nightMode ? "bg-gradient-to-br from-[#181825] via-[#23243a] to-[#181b26]" : "bg-gradient-to-br from-[#181c32] to-[#161927]/90"}`}>
      {/* Spicy animated genre gradient background (ALWAYS COLORFUL) */}
      <div className={`absolute inset-0 spicy-bg bg-gradient-to-br ${currentGenreToDisplay.color} z-[-1]`} />
      {/* Animated blobs for extra depth (muted in night mode) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute w-96 h-96 rounded-full blur-3xl animate-pulse left-1/4 top-1/3 ${
          nightMode ? "bg-gray-700/40" : "bg-pink-400/30"
        }`}></div>
        <div className={`absolute w-80 h-80 rounded-full blur-2xl animate-pulse right-1/4 bottom-1/4 ${
          nightMode ? "bg-gray-800/30" : "bg-cyan-400/20"
        }`}></div>
      </div>
      {/* Genre/Mood Sidebar */}
      <aside className="w-64 flex flex-col border-r border-blue-900/60 p-6 bg-transparent">
        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${mode === 'genre' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
            onClick={() => setMode('genre')}
          >
            Genre
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${mode === 'mood' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
            onClick={() => setMode('mood')}
          >
            Mood
          </button>
        </div>
        {mode === 'genre' ? (
          <>
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
          </>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold mb-4 tracking-wide text-blue-200">Moods</h2>
            <nav className="flex flex-col gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.id}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg text-left transition-all font-semibold
                    ${activeMood === mood.id
                      ? `bg-gradient-to-r ${mood.color} text-white shadow-lg`
                      : `text-blue-100 hover:bg-gray-800/60`
                    }`}
                  onClick={() => setActiveMood(mood.id)}
                >
                  <span className="w-3 h-3 rounded-full mr-2" style={{ background: activeMood === mood.id ? 'white' : '#60a5fa' }}></span>
                  {mood.name}
                </button>
              ))}
            </nav>
          </>
        )}
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-10">
        {mode === 'genre' ? (
          // ...existing genre main content...
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-fit z-10">
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
                                Live
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`transition-all rounded-full p-3
                          ${isPlayingThisStation ? "bg-pink-500/10 text-pink-500" : "text-cyan-500 border-cyan-500/30 hover:bg-cyan-500/10"}
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStationPlay(station, currentGenreToDisplay.id, station.genreTag);
                        }}
                      >
                        {isPlayingThisStation ? (
                          <PauseCircle className="w-5 h-5" />
                        ) : (
                          <PlayCircle className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          // Mood mode content
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-fit z-10">
                <h1 className={`font-black text-5xl text-transparent bg-clip-text bg-gradient-to-r ${currentGenreToDisplay.color}`}>
                  {activeMood ? activeMood.toUpperCase() + ' VIBES' : 'Select a Mood'}
                </h1>
                <p className={`mt-4 text-xl ${textClass}`}>
                  {activeMood ? `Stations that match your ${activeMood} mood.` : 'Choose a mood to see matching stations.'}
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {moodStations.length > 0 ? (
                moodStations.map((station) => {
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
                                <Badge className="ml-2 bg-red-600/20 text-red-400 border-red-500/30 px-2 py-1">LIVE</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className={`transition-all rounded-full p-3
                            ${isPlayingThisStation ? "bg-pink-500/10 text-pink-500" : "text-cyan-500 border-cyan-500/30 hover:bg-cyan-500/10"}
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStationPlay(station, station.genre, station.genreTag);
                          }}
                        >
                          {isPlayingThisStation ? (
                            <PauseCircle className="w-5 h-5" />
                          ) : (
                            <PlayCircle className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-lg text-gray-400">
                    No stations found for this mood. Try another mood or check back later.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {overlay}
    </section>
  );
};

export default GenreStations;