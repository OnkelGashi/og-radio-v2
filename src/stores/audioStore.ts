// src/stores/audioStore.ts
// (This is the refined code from the previous response - ensure this is in place)
import { create } from 'zustand';
import { toast } from "@/components/ui/sonner";

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
  isPlaying: boolean;
  nowPlayingInfo: NowPlayingInfo | null;
  lastPlayedInfo: NowPlayingInfo | null;
  isWelcomeAudioPlaying: boolean;
  volume: number;
  activeGenreForTheme: string | null;

  setAudioElement: (element: HTMLAudioElement) => void;
  playItem: (itemInfo: NowPlayingInfo) => void;
  playWelcomeAndThenDefault: () => void;
  togglePlayPause: () => void;
  pauseAllAudio: () => void;
  setVolume: (volume: number) => void;
  setActiveGenreForTheme: (genre: string | null) => void;
  stopPlayback: () => void;
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
  isPlaying: false,
  nowPlayingInfo: EMPTY_NOW_PLAYING_INFO,
  lastPlayedInfo: null,
  isWelcomeAudioPlaying: false,
  volume: 1,
  activeGenreForTheme: null,

  setAudioElement: (element) => {
    const { volume } = get();
    if (element) {
      element.volume = volume;
    }
    set({ audioElement: element });
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
    const { audioElement, volume, setActiveGenreForTheme, stopPlayback } = get();

    if (!itemInfo || !itemInfo.src || typeof itemInfo.src !== 'string' || itemInfo.src.trim() === "") {
      // toast({ title: "Playback Error", description: `Cannot play "${itemInfo?.title || 'Unknown Track'}". Audio source is missing.`, variant: "destructive" });
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
    const { isPlaying, nowPlayingInfo, playItem, pauseAllAudio, lastPlayedInfo } = get();

    if (isPlaying) {
      pauseAllAudio();
    } else {
      if (nowPlayingInfo && nowPlayingInfo.type !== 'none' && nowPlayingInfo.src) {
        playItem(nowPlayingInfo);
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
}));