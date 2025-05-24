import { useState } from "react";
import { Disc, Radio, PlayCircle, PauseCircle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Genre stations data
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

const GenreStations = () => {
  const [currentTab, setCurrentTab] = useState(genreStations[0].id);
  const [playingStation, setPlayingStation] = useState<string | null>(null);

  const handleStationPlay = (stationId: string) => {
    if (playingStation === stationId) {
      setPlayingStation(null);
    } else {
      setPlayingStation(stationId);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Genre Stations
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
            Explore OnkelGashi's diverse sound universe through curated stations for every mood and genre. Dive into sonic worlds crafted with passion and precision.
          </p>

          <Tabs defaultValue={currentTab} onValueChange={setCurrentTab} className="w-full">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <TabsList className="relative flex flex-wrap justify-center gap-1 bg-transparent">
                {genreStations.map((genre) => (
                  <TabsTrigger 
                    key={genre.id}
                    value={genre.id}
                    className={`rounded-full transition-all duration-300 border border-gray-700 bg-gray-900/50 backdrop-blur-sm data-[state=active]:bg-gradient-to-r ${genre.color} data-[state=active]:text-white`}
                  >
                    <Radio className="w-4 h-4 mr-1.5" />
                    {genre.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {genreStations.map((genre) => (
              <TabsContent key={genre.id} value={genre.id} className="mt-8">
                <div className="bg-gradient-to-br bg-opacity-10 rounded-xl p-6 border border-gray-800 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${genre.color} bg-clip-text text-transparent`}>
                        {genre.name} Stations
                      </h3>
                      <p className="text-gray-400">{genre.description}</p>
                    </div>
                    <Badge className={`bg-gradient-to-r ${genre.color} text-white`}>
                      <Disc className="w-3 h-3 mr-1" />
                      {genre.stations.filter(s => s.isLive).length} Live
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {genre.stations.map((station) => (
                      <Card 
                        key={station.id} 
                        className={`bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all ${playingStation === station.id ? 'ring-2 ring-offset-2 ring-offset-black' : ''} ${playingStation === station.id ? `ring-gradient-to-r ${genre.color}` : ''}`}
                      >
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${genre.color} flex items-center justify-center mr-4`}>
                              {playingStation === station.id ? (
                                <Volume2 className="w-5 h-5 text-white animate-pulse" />
                              ) : (
                                <Radio className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{station.name}</h4>
                              <div className="flex items-center text-sm">
                                <span className="text-gray-400">{station.listeners} listening</span>
                                {station.isLive && (
                                  <Badge className="ml-2 bg-red-600/20 text-red-400 border-red-500/30">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                                    LIVE
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => handleStationPlay(station.id)}
                            size="sm"
                            className={`rounded-full ${playingStation === station.id ? 'bg-white text-black hover:bg-gray-200' : `bg-gradient-to-r ${genre.color} text-white`}`}
                          >
                            {playingStation === station.id ? (
                              <PauseCircle className="w-4 h-4 mr-1" />
                            ) : (
                              <PlayCircle className="w-4 h-4 mr-1" />
                            )}
                            {playingStation === station.id ? 'Pause' : 'Play'}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default GenreStations;
