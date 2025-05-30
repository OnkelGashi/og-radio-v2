// src/stores/audioStore.ts
// (This is the refined code from the previous response - ensure this is in place)
import { create } from 'zustand';
import { toast } from "@/components/ui/sonner";
import { useRef } from "react";

export interface NowPlayingInfo {
  id: string;
  type: 'track' | 'station' | 'playlist' | 'welcome' | 'none';
  src: string;
  title: string;
  artistOrContext: string;
  genre: string | null; // Should be the genre ID, e.g., "hip-hop"
  artwork?: string;
}

interface AudioState {
  audioElement: HTMLAudioElement | null;
  audioContext: AudioContext | null;
  mediaElementSource: MediaElementAudioSourceNode | null;
  isPlaying: boolean;
  nowPlayingInfo: NowPlayingInfo | null;
  lastPlayedInfo: NowPlayingInfo | null;
  isWelcomeAudioPlaying: boolean;
  volume: number;
  activeGenreForTheme: string | null;
  isVisualizerOpen: boolean;
  hasPlayedWelcomeThisSession: boolean; // <-- Add this line!

  setAudioElement: (element: HTMLAudioElement | null) => void;
  playItem: (itemInfo: NowPlayingInfo) => void;
  playWelcomeAndThenDefault: () => void;
  togglePlayPause: () => void;
  pauseAllAudio: () => void;
  setVolume: (volume: number) => void;
  setActiveGenreForTheme: (genre: string | null) => void;
  stopPlayback: () => void;
  setIsVisualizerOpen: (isOpen: boolean) => void;
}

export const WELCOME_AUDIO_INFO: NowPlayingInfo = {
  id: 'welcome_track',
  type: 'welcome',
  src: "/audio/welcome/Welcome.mp3",
  title: "Welcome to OG Radio",
  artistOrContext: "OnkelGashi",
  genre: null,
};

export const EMPTY_NOW_PLAYING_INFO: NowPlayingInfo = {
  id: 'empty_state',
  type: 'none',
  src: "",
  title: "Ready to Play",
  artistOrContext: "Select a station or track",
  genre: null,
};

export const useAudioStore = create<AudioState>((set, get) => ({
  audioElement: null,
  audioContext: null,
  mediaElementSource: null,
  isPlaying: false,
  nowPlayingInfo: EMPTY_NOW_PLAYING_INFO,
  lastPlayedInfo: null,
  isWelcomeAudioPlaying: false,
  volume: 0.5, // 50% by default
  activeGenreForTheme: null,
  isVisualizerOpen: false,
  hasPlayedWelcomeThisSession: false, // <-- Add this line!

  setAudioElement: (element) => {
    if (!element) {
      set({ audioElement: null, mediaElementSource: null });
      return;
    }
    let ctx = get().audioContext;
    if (!ctx) {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      set({ audioContext: ctx });
    }
    // Always create a new MediaElementSource for a new element
    let src: MediaElementAudioSourceNode | null = null;
    try {
      src = ctx.createMediaElementSource(element);
      src.connect(ctx.destination); // <-- Ensure connection here!
    } catch (e) {
      // If already created for this element, reuse the previous one
      src = get().mediaElementSource || null;
    }
    set({ audioElement: element, mediaElementSource: src });
  },

  setActiveGenreForTheme: (genreId) => {
    set({ activeGenreForTheme: genreId });
  },

  stopPlayback: () => {
    const { audioElement, setActiveGenreForTheme } = get();
    if (audioElement && !audioElement.paused) {
      audioElement.pause();
    }
    set({
      isPlaying: false,
      isWelcomeAudioPlaying: false,
      nowPlayingInfo: EMPTY_NOW_PLAYING_INFO,
      // lastPlayedInfo is NOT cleared, so resume is possible
    });
    setActiveGenreForTheme(null); // Reset theme to default
  },

  playItem: (itemInfo) => {
    const { audioElement, audioContext, mediaElementSource, volume, setActiveGenreForTheme, stopPlayback } = get();

    // Block welcome audio if already played this session
    if (
      itemInfo.type === 'welcome' &&
      get().hasPlayedWelcomeThisSession
    ) {
      toast("Welcome audio can only be played once per session.", {
        className: "bg-yellow-700 text-white"
      });
      return;
    }

    // Mark welcome as played if it's being played now
    if (itemInfo.type === 'welcome') {
      set({ hasPlayedWelcomeThisSession: true });
    }

    if (!itemInfo || !itemInfo.src || typeof itemInfo.src !== 'string' || itemInfo.src.trim() === "") {
      if (get().nowPlayingInfo?.id === itemInfo?.id) {
        set({ nowPlayingInfo: EMPTY_NOW_PLAYING_INFO, isPlaying: false });
      } else {
        set({ isPlaying: false });
      }
      setActiveGenreForTheme(null);
      return;
    }

    if (!audioElement) {
      set({
        nowPlayingInfo: itemInfo,
        isPlaying: itemInfo.type !== 'none',
        isWelcomeAudioPlaying: itemInfo.type === 'welcome',
        lastPlayedInfo: itemInfo.type !== 'welcome' && itemInfo.type !== 'none' ? itemInfo : get().lastPlayedInfo,
      });
      setActiveGenreForTheme(itemInfo.genre);
      return;
    }

    audioElement.pause();

    set({
      nowPlayingInfo: itemInfo,
      isPlaying: false,
      isWelcomeAudioPlaying: itemInfo.type === 'welcome',
      lastPlayedInfo: itemInfo.type !== 'welcome' && itemInfo.type !== 'none' ? itemInfo : get().lastPlayedInfo,
    });
    setActiveGenreForTheme(itemInfo.genre);

    audioElement.src = itemInfo.src;
    audioElement.volume = volume;
    audioElement.onended = null;

    // Ensure audio is connected
    if (audioElement && audioContext && mediaElementSource) {
      try {
        mediaElementSource.connect(audioContext.destination);
      } catch (e) {
        // Already connected, ignore
      }
    }

    const playPromise = audioElement.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (get().nowPlayingInfo?.id === itemInfo.id) {
          set({ isPlaying: true });
        } else {
          audioElement.pause();
          return;
        }

        const handleEnd = () => {
          if (get().nowPlayingInfo?.id === itemInfo.id) {
            stopPlayback();
          }
        };
        audioElement.onended = handleEnd;

      }).catch(error => {
        if (get().nowPlayingInfo?.id === itemInfo.id) {
          set({ isPlaying: false, isWelcomeAudioPlaying: false, nowPlayingInfo: EMPTY_NOW_PLAYING_INFO });
        }
        setActiveGenreForTheme(null);
        toast("Playback Error", {
          description: "Could not play this track.",
          className: "bg-red-900 text-white"
        });
      });
    } else {
      // Legacy browser fallback
      if (get().nowPlayingInfo?.id === itemInfo.id) {
        set({ isPlaying: true });
        const handleEndLegacy = () => {
          if (get().nowPlayingInfo?.id === itemInfo.id) {
            if (audioElement) audioElement.onended = null;
            stopPlayback();
          }
        };
        audioElement.onended = handleEndLegacy;
      }
    }
  },

  playWelcomeAndThenDefault: () => {
    get().playItem(WELCOME_AUDIO_INFO);
  },

  pauseAllAudio: () => {
    const { audioElement } = get();
    if (audioElement && !audioElement.paused) {
      audioElement.pause();
    }
    set({ isPlaying: false });
    // Do not reset theme or nowPlayingInfo here, so resume is possible
  },

  togglePlayPause: () => {
    const { isPlaying, audioElement, nowPlayingInfo, pauseAllAudio, lastPlayedInfo, playItem } = get();

    if (isPlaying) {
      pauseAllAudio();
    } else {
      // Only resume if audioElement is loaded and src matches nowPlayingInfo
      if (
        audioElement &&
        nowPlayingInfo &&
        nowPlayingInfo.type !== 'none' &&
        nowPlayingInfo.src &&
        audioElement.src.includes(nowPlayingInfo.src)
      ) {
        audioElement.play();
        set({ isPlaying: true });
      } else if (lastPlayedInfo && lastPlayedInfo.src) {
        playItem(lastPlayedInfo);
      } else {
        // Optionally, show a toast or scroll to stations
      }
    }
  },

  setVolume: (volume) => {
    const { audioElement } = get();
    const newVolume = Math.max(0, Math.min(1, volume));
    if (audioElement) {
      audioElement.volume = newVolume;
    }
    set({ volume: newVolume });
  },

  setIsVisualizerOpen: (isOpen) => set({ isVisualizerOpen: isOpen }),
}));

const useInitAudioContext = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const initAudioContext = (audioElement: HTMLAudioElement) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
      mediaElementSourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      mediaElementSourceRef.current.connect(audioContextRef.current.destination);
      // Save these in your Zustand store if needed
    }
  };

  return { initAudioContext };
};

// No hook calls outside components!