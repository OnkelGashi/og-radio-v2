import { Calendar, Clock, Radio, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getHeadingTextColorClass, getBodyTextColorClass } from "@/utils/textColors";
import ScheduleCTAButton from "@/components/ScheduleCTAButton";

type StreamScheduleProps = {
  activeGenre?: string | null;
};

const StreamSchedule = ({ activeGenre }: StreamScheduleProps) => {
  // 👇 PASTE YOUR FULL SCHEDULE ARRAY HERE
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

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-6 transition-colors duration-300 ${getHeadingTextColorClass(activeGenre || null)}`}>
            Stream Schedule
          </h2>
          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${getBodyTextColorClass(activeGenre || null)}`}>
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
