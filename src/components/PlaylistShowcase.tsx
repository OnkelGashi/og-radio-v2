import { useState } from "react";
import { Play, Shuffle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getHeadingTextColorClass, getBodyTextColorClass } from "@/utils/textColors";

type Props = {
  activeGenre?: string | null;
};

const PlaylistShowcase = ({ activeGenre }: Props) => {
  const [activeFilter, setActiveFilter] = useState("All");

  // 👇 PASTE YOUR FULL PLAYLIST ARRAY HERE
  const playlists = [
    {
      id: 1,
      title: "Nocturnal Frequencies",
      description: "Deep, atmospheric beats for late-night sessions",
      trackCount: 24,
      genre: "Ambient",
      mood: "Chill",
      color: "from-blue-600 to-indigo-600"
    },
    {
      id: 2,
      title: "Digital Underground",
      description: "Raw trap energy meets futuristic soundscapes",
      trackCount: 31,
      genre: "Trap",
      mood: "Energy",
      color: "from-purple-600 to-pink-600"
    },
    {
      id: 3,
      title: "Indie Futures",
      description: "Pop melodies wrapped in electronic innovation",
      trackCount: 18,
      genre: "Indie Pop",
      mood: "Uplifting",
      color: "from-cyan-600 to-blue-600"
    },
    {
      id: 4,
      title: "Bass Chronicles",
      description: "Heavy drops and intricate rhythms that move crowds",
      trackCount: 27,
      genre: "EDM",
      mood: "Energy",
      color: "from-green-600 to-teal-600"
    },
    {
      id: 5,
      title: "Ethereal Journeys",
      description: "Cinematic soundscapes for content creators",
      trackCount: 22,
      genre: "Cinematic",
      mood: "Atmospheric",
      color: "from-orange-600 to-red-600"
    },
    {
      id: 6,
      title: "Gaming Pulse",
      description: "High-energy tracks designed for immersive experiences",
      trackCount: 35,
      genre: "Electronic",
      mood: "Intense",
      color: "from-violet-600 to-purple-600"
    }
  ];

  const filters = ["All", "Chill", "Energy", "Uplifting", "Atmospheric", "Intense"];
  const filteredPlaylists = activeFilter === "All"
    ? playlists
    : playlists.filter(playlist => playlist.mood === activeFilter);

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 relative transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-6 transition-colors duration-300 ${
    activeGenre === "ambient" || activeGenre === "indie" || activeGenre === "lofi" || activeGenre === "jazz"
      ? "text-white"
      : getHeadingTextColorClass(activeGenre || null)
  }`}>
            Mo0d Playlists
          </h2>
          <p className={`text-2xl max-w-2xl mx-auto mb-8 transition-colors duration-300 ${
    activeGenre === "ambient" || activeGenre === "indie" || activeGenre === "lofi" || activeGenre === "jazz"
      ? "text-white"
      : getBodyTextColorClass(activeGenre || null)
  }`}>
            Discover collections crafted for every mood and moment. Each playlist tells a unique sonic story.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Filter className="w-5 h-5 text-gray-400 mr-2 self-center" />
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "border-gray-600 text-black hover:bg-gray-800"
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlaylists.map((playlist) => (
            <Card key={playlist.id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300 group overflow-hidden backdrop-blur-sm hover:transform hover:scale-105">
              <div className={`h-48 bg-gradient-to-br ${playlist.color} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 gap-1 h-full">
                    {[...Array(64)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-white/30 animate-pulse"
                        style={{
                          animationDelay: `${Math.random() * 2000}ms`,
                          animationDuration: `${Math.random() * 1000 + 1000}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="lg" className="rounded-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                    <Play className="w-6 h-6" />
                  </Button>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-black/40 backdrop-blur-sm text-white text-xs">
                    {playlist.genre}
                  </Badge>
                  <Badge className="bg-black/40 backdrop-blur-sm text-white text-xs">
                    {playlist.mood}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    {playlist.trackCount} tracks
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{playlist.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {playlist.description}
                </p>
                <div className="flex items-center justify-between">
                  <Button size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10">
                    <Play className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlaylistShowcase;
