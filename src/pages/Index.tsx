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
import { useState } from "react";

const genreBackgrounds: Record<string, string> = {
  "hip-hop": "bg-hiphop",
  "electronic": "bg-electronic",
  "rap": "bg-rap",
  "rnb": "bg-rnb",
  "indie": "bg-indie",
  "ambient": "bg-ambient",
  "jazz": "bg-jazz",
  "rock": "bg-rock",
  "lofi": "bg-lofi",
  "experimental": "bg-experimental",
};

export default function Index() {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  // Compute background class
  const backgroundClass = activeGenre ? genreBackgrounds[activeGenre] : "bg-default-og";

  return (
    <div className={`min-h-screen text-white overflow-hidden transition-all duration-700 ${backgroundClass}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* (Your animated dots/stars or background SVGs, etc.) */}
      </div>
      <NowPlaying />
      <Hero />
      <AboutSection />
      <OnkelGashiPicks />
      <GenreStations activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
      <PlaylistShowcase />
      <StreamSchedule />
      <SocialFooter />
    </div>
  );
}
