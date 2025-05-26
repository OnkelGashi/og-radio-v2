// src/stores/audioStore.ts
import { create } from 'zustand';

interface AudioState {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  currentSongSrc: string;
  setAudioElement: (element: HTMLAudioElement) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  playSong: (src?: string) => void;
  pauseSong: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  audioElement: null,
  isPlaying: false,
  currentSongSrc: "/faded-frequencies.mp3", // Default song from your NowPlaying
  setAudioElement: (element) => {
    const { audioElement: existingElement } = get();
    if (existingElement) {
        // Clean up old listeners if any were attached directly or via the store
        // For now, we assume NowPlaying.tsx handles its own internal listeners
    }
    set({ audioElement: element });
  },
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  togglePlay: () => {
    const { audioElement, isPlaying, currentSongSrc } = get();
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        set({ isPlaying: false });
      } else {
        if (audioElement.src !== window.location.origin + currentSongSrc) {
            audioElement.src = currentSongSrc; // Ensure full path if needed or handle base URL
        }
        audioElement.play().catch(error => {
          console.error("Error playing audio:", error);
          set({ isPlaying: false });
        });
        set({ isPlaying: true });
      }
    }
  },
  playSong: (src?: string) => {
    const { audioElement, currentSongSrc } = get();
    const songToPlay = src || currentSongSrc;
    if (audioElement) {
      if (audioElement.src !== window.location.origin + songToPlay) {
        audioElement.src = songToPlay;
      }
      audioElement.play().catch(error => {
          console.error("Error playing audio:", error);
          set({ isPlaying: false });
        });
      set({ isPlaying: true, currentSongSrc: songToPlay });
    }
  },
  pauseSong: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      set({ isPlaying: false });
    }
  },
}));