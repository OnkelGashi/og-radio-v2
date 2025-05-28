import { Calendar, Clock, Radio, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScheduleCTAButton from "@/components/ScheduleCTAButton";
import { getDynamicTextClass } from "@/utils/textColors";

type StreamScheduleProps = {
  activeGenre?: string | null;
};

const genreGradientMap: Record<string, string> = {
  lofi: "from-[#A0522D] via-[#E0BBE4] to-[#957DAD]",
  "hip-hop": "from-[#FF00FF] via-[#FFFF00] to-[#00CCFF]",
  electronic: "from-[#0A0A2A] via-[#6600FF] to-[#00FFFF]",
  rap: "from-[#333333] via-[#FF6600] to-[#FFCC00]",
  rnb: "from-[#4A0033] via-[#800040] to-[#FF99CC]",
  indie: "from-[#6B7A8F] via-[#A7C7E7] to-[#E6E6FA]",
  ambient: "from-[#0D0D1A] via-[#330066] to-[#66FFFF]",
  jazz: "from-[#1A1A1A] via-[#4F4F4F] to-[#B28B00]",
  rock: "from-[#330000] via-[#CC0000] to-[#FF9900]",
  experimental: "from-[#FF0000] via-[#00FF00] to-[#0000FF]",
  // Add more as needed
};

const StreamSchedule = ({ activeGenre }: StreamScheduleProps) => {
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
    (activeGenre && genreGradientMap[activeGenre]) || "from-blue-900/70 to-[#0d1117]";
  const headingTextClass = getDynamicTextClass(gradientString);
  const bodyTextClass = getDynamicTextClass(gradientString);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Spicy animated gradient background */}
      <div className={`absolute inset-0 spicy-bg bg-gradient-to-br ${gradientString} z-[-1]`} />
      {/* Animated blobs for extra depth */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-pulse left-1/4 top-1/3"></div>
        <div className="absolute w-80 h-80 bg-cyan-400/20 rounded-full blur-2xl animate-pulse right-1/4 bottom-1/4"></div>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-6 transition-colors duration-300 ${headingTextClass}`}>
            Stream Schedule
          </h2>
          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${bodyTextClass}`}>
            Catch live shows, exclusive premieres, and special events. Your soundtrack is always on.
          </p>
        </div>
        {/* Schedule Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedule.map((show) => (
            <Card key={show.id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300 group">
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
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
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
    </section>
  );
};

export default StreamSchedule;
