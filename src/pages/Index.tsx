import { Play, Music, Radio, Users, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import PlaylistShowcase from "@/components/PlaylistShowcase";
import NowPlaying from "@/components/NowPlaying";
import StreamSchedule from "@/components/StreamSchedule";
import SocialFooter from "@/components/SocialFooter";
import GenreStations from "@/components/GenreStations";
import GenreBackground from "@/components/GenreBackground";
import { useState } from "react";

export default function Index() {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  return (
    <div className="min-h-screen text-white overflow-hidden transition-all duration-700 relative">
      {/* Genre-reactive animated background */}
      <GenreBackground genre={activeGenre} />

      <NowPlaying activeGenre={activeGenre} />
      <Hero activeGenre={activeGenre} />
      <AboutSection activeGenre={activeGenre} />
      <GenreStations activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
      <PlaylistShowcase activeGenre={activeGenre} />
      <StreamSchedule activeGenre={activeGenre} />
      <SocialFooter />
    </div>
  );
}
