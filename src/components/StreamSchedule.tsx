import { Calendar, Clock, Radio, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScheduleCTAButton from "@/components/ScheduleCTAButton";
import { getDynamicTextClass } from "@/utils/textColors";
import { useUIStore } from "@/stores/uiStore";

type StreamScheduleProps = {
  activeGenre?: string | null;
};

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
  // Add more as needed
};

const StreamSchedule = ({ activeGenre }: StreamScheduleProps) => {
  const nightMode = useUIStore((s) => s.nightMode);

  const schedule = [
    {
      id: 1,
      title: "Late Night Frequencies",
      time: "23:00 - 02:00",
      description: "Deep atmospheric sessions for night owls",
      type: "Regular Show",
      status: "live"
    },
    {
      id: 2,
      title: "Morning Pulse",
      time: "07:00 - 10:00",
      description: "Energetic beats to start your day right",
      type: "Regular Show",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Weekend Vibes Special",
      time: "Sat 20:00 - 24:00",
      description: "Extended sets with exclusive previews",
      type: "Special Event",
      status: "featured"
    }
  ];

  // Get the gradient for the active genre, or fallback
  const gradientString =
    (activeGenre && genreGradientMap[activeGenre]) || "from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]";
  const headingTextClass = getDynamicTextClass(gradientString);
  const bodyTextClass = getDynamicTextClass(gradientString);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative bg-transparent">
      {/* Spicy animated gradient background */}
      {/* Remove or comment out the following div to show the LiveBackground behind the section */}
      {/*
      <div className={`absolute inset-0 spicy-bg bg-gradient-to-br ${
        nightMode
          ? "from-[#23243a] via-[#181825] to-[#23243a]"
          : gradientString
      } z-[-1]`} />
      */}
      {/* Animated blobs for extra depth */}
      {/* Optionally remove the blobs too if you want only LiveBackground */}
      {/*
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute w-96 h-96 rounded-full blur-3xl animate-pulse left-1/4 top-1/3 ${
          nightMode ? "bg-gray-700/40" : "bg-pink-400/30"
        }`}></div>
        <div className={`absolute w-80 h-80 rounded-full blur-2xl animate-pulse right-1/4 bottom-1/4 ${
          nightMode ? "bg-gray-800/30" : "bg-cyan-400/20"
        }`}></div>
      </div>
      */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-6 transition-colors duration-300 ${
            nightMode
              ? "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent"
              : headingTextClass
          }`}>
            Stream Schedule
          </h2>
          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${
            nightMode ? "text-gray-300" : bodyTextClass
          }`}>
            Catch live shows, exclusive premieres, and special events. Your soundtrack is always on.
          </p>
        </div>
        {/* Schedule Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedule.map((show) => (
            <Card
              key={show.id}
              className={`transition-all duration-300 group
                ${nightMode
                  ? ""
                  : ""}
              `}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-cyan-400 mr-2" />
                    <span className="text-cyan-400 font-medium">{show.time}</span>
                  </div>
                  <Badge className={`
                    ${show.status === 'live' ? 'bg-red-600/20 text-red-400 border-red-500/30' : ''}
                    ${show.status === 'upcoming' ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : ''}
                    ${show.status === 'featured' ? 'bg-purple-600/20 text-purple-400 border-purple-500/30' : ''}
                  `}>
                    {show.status === 'live' && (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                        LIVE
                      </>
                    )}
                    {show.status === 'upcoming' && 'UPCOMING'}
                    {show.status === 'featured' && 'FEATURED'}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{show.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{show.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${
                    nightMode
                      ? "text-gray-400 bg-gray-800"
                      : "text-gray-500 bg-gray-800"
                  }`}>
                    {show.type}
                  </span>
                  {show.status === 'live' && (
                    <Button size="sm" className="bg-red-600 hover:bg-red-500 text-white">
                      <Users className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        {/* Full Schedule CTA */}
        <div className="text-center mt-12">
          <ScheduleCTAButton>
            View Full Schedule
          </ScheduleCTAButton>
        </div>
      </div>
      {/* ...existing code... */}
    </section>
  );
};

export default StreamSchedule;
