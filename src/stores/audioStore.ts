// src/stores/audioStore.ts
import { create } from 'zustand';

interface AudioState {
  audioElement: HTMLAudioElement | null;
  audioContext: AudioContext | null; // Add AudioContext here
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
  audioContext: null, // Initialize
  isPlaying: false,
  currentSongSrc: "/faded-frequencies.mp3",

  setAudioElement: (element) => {
    const { audioContext: existingCtx } = get();
    let currentCtx = existingCtx;
    if (element && !existingCtx) {
      currentCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    set({ audioElement: element, audioContext: currentCtx });
  },

  setIsPlaying: (playing) => set(state => {
    // Only update if the state is actually different
    if (state.isPlaying !== playing) {
      return { isPlaying: playing };
    }
    return {}; // No change
  }),

  togglePlay: () => {
    const { audioElement, isPlaying, audioContext, currentSongSrc } = get();
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume(); // Attempt to resume context first
    }
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        // setIsPlaying(false) will be called by the 'pause' event listener
      } else {
        if (audioElement.src !== window.location.origin + currentSongSrc) {
             audioElement.src = currentSongSrc;
             audioElement.load(); // Important when changing src
        }
        audioElement.play().catch(error => {
          console.error("audioStore: Error in togglePlay -> play():", error);
          set({ isPlaying: false }); // Ensure state reflects failure
        });
        // setIsPlaying(true) will be called by the 'play' event listener
      }
    }
  },

  playSong: (src?: string) => {
    const { audioElement, audioContext, currentSongSrc } = get();
    const songToPlay = src || currentSongSrc;
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume();
    }
    if (audioElement) {
      if (audioElement.src !== window.location.origin + songToPlay) {
        audioElement.src = songToPlay;
        audioElement.load();
      }
      audioElement.play().catch(error => {
        console.error(`audioStore: Error in playSong(${songToPlay}):`, error);
        set({ isPlaying: false });
      });
      // Event listener will call setIsPlaying(true)
      set({ currentSongSrc: songToPlay }); // Update current song src
    }
  },

  pauseSong: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      // Event listener will call setIsPlaying(false)
    }
  },
}));