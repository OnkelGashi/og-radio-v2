import { Play, Music, Radio, Users, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import PlaylistShowcase from "@/components/PlaylistShowcase";
import OnkelGashiPicks from "@/components/OnkelGashiPicks";
import NowPlaying from "@/components/NowPlaying";
import StreamSchedule from "@/components/StreamSchedule";
import SocialFooter from "@/components/SocialFooter";
import GenreStations from "@/components/GenreStations";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40 delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-20 delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-indigo-400 rounded-full animate-pulse opacity-25 delay-500"></div>
      </div>

      {/* Now Playing Bar */}
      <NowPlaying />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <AboutSection />

      {/* OnkelGashi's Picks */}
      <OnkelGashiPicks />

      {/* Genre Stations */}
      <GenreStations />

      {/* Playlist Showcase */}
      <PlaylistShowcase />

      {/* Stream Schedule */}
      <StreamSchedule />

      {/* Social Footer */}
      <SocialFooter />
    </div>
  );
};

export default Index;
