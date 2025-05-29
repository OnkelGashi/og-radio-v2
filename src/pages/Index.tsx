import { Play, Music, Radio, Users, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import NowPlaying from "@/components/NowPlaying";
import StreamSchedule from "@/components/StreamSchedule";
import SocialFooter from "@/components/SocialFooter";
import GenreStations from "@/components/GenreStations";
import { useAudioStore } from "@/stores/audioStore";
import GenreBackground from "@/components/GenreBackground";
import { useState, useEffect, useRef } from "react";


export default function Index() {
  const { activeGenreForTheme } = useAudioStore();
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  return (
    <div className="min-h-screen text-white overflow-x-hidden transition-all duration-700 relative">
      {/* Genre-reactive animated background */}
      <GenreBackground genre={activeGenreForTheme} />

      <NowPlaying />
      <Hero />
      <AboutSection activeGenre={activeGenreForTheme} />

      {/* Add an ID to this section for scroll targeting */}
      <div id="genre-stations-section">
        <GenreStations activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
      </div>

      <StreamSchedule activeGenre={activeGenreForTheme} />
      <SocialFooter />
    </div>
  );
}
