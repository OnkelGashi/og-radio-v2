import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const OnkelGashiPicks = () => {
  const picks = [
    {
      id: 1,
      title: "Midnight Frequencies",
      note: "This one came to me during a 3 AM studio session. The synths just... spoke to me. Pure late-night energy.",
      genre: "Future Bass",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Underground Pulse",
      note: "Raw, unfiltered emotion. Started with a simple kick pattern and let the story build itself. Sometimes the best tracks write themselves.",
      genre: "Dark Trap",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Digital Dreams",
      note: "What if nostalgia had a sound? This track bridges my early influences with where I'm heading. It's personal.",
      genre: "Synthwave Pop",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            OnkelGashi's Picks
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Personal favorites with the stories behind them. These tracks shaped my journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {picks.map((pick) => (
            <Card key={pick.id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300 group overflow-hidden backdrop-blur-sm">
              <div className={`h-48 bg-gradient-to-br ${pick.color} relative overflow-hidden`}>
                {/* Waveform Visualization */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="flex space-x-1">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white rounded animate-pulse"
                        style={{
                          height: `${Math.random() * 60 + 20}%`,
                          animationDelay: `${i * 100}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="lg" className="rounded-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                    <Heart className="w-6 h-6" />
                  </Button>
                </div>

                {/* Genre Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    {pick.genre}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{pick.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 italic">
                  "{pick.note}"
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                    Preview
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OnkelGashiPicks;
