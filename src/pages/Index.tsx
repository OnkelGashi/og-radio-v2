// src/pages/Index.tsx
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import PlaylistShowcase from "@/components/PlaylistShowcase";
import NowPlaying from "@/components/NowPlaying";
import StreamSchedule from "@/components/StreamSchedule";
import SocialFooter from "@/components/SocialFooter";
import GenreStations from "@/components/GenreStations";
import GenreBackground from "@/components/GenreBackground"; // Using your original static background
import { useState, useEffect } from "react";
import { useAudioStore } from "@/stores/audioStore"; // We might need this for an explicit initial play trigger

export default function Index() {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  // This effect now only runs once on mount.
  // Its main job is to respect the store's initial `isPlaying` state if set,
  // assuming user interaction has already occurred via Hero.
  useEffect(() => {
    const { isPlaying, audioElement, togglePlay } = useAudioStore.getState();
    
    // Check if the user *intends* for music to play (via store)
    // AND the audio element is ready but paused.
    if (isPlaying && audioElement && audioElement.paused) {
      console.log("Index.tsx: Component mounted. Store says play, audio is paused. Attempting to play via togglePlay.");
      // togglePlay will attempt to play the currentSongSrc.
      // This relies on the Hero button having already unblocked audio.
      togglePlay(); 
    }
  }, []); // Empty dependency array: run once on mount.

  return (
    <div className="min-h-screen text-white overflow-hidden transition-all duration-700 relative">
      <GenreBackground genre={activeGenre} /> {/* Fallback to static background */}
      
      <NowPlaying /> {/* This will now manage its own playback based on the store */}
      <Hero activeGenre={activeGenre} /> {/* Crucial for first user interaction */}
      <AboutSection activeGenre={activeGenre} />
      <GenreStations activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
      <PlaylistShowcase activeGenre={activeGenre} />
      <StreamSchedule activeGenre={activeGenre} />
      <SocialFooter />
    </div>
  );
}