// src/stores/audioStore.ts
import { create } from 'zustand';

interface AudioState {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  currentSongSrc: string;
  setAudioElement: (element: HTMLAudioElement | null) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  playNewSong: (src: string) => void; // To explicitly change song and play
}

export const useAudioStore = create<AudioState>((set, get) => ({
  audioElement: null,
  isPlaying: false,
  currentSongSrc: "/faded-frequencies.mp3", // Default song

  setAudioElement: (element) => {
    console.log("AudioStore: setAudioElement called with", element);
    set({ audioElement: element });
  },

  setIsPlaying: (playing) => set(state => {
    if (state.isPlaying !== playing) {
      console.log("AudioStore: setIsPlaying from", state.isPlaying, "to", playing);
      return { isPlaying: playing };
    }
    console.log("AudioStore: setIsPlaying called but state is already", playing);
    return {}; // No change, crucial to prevent loops
  }),

  togglePlay: () => {
    const { audioElement, isPlaying, currentSongSrc, setIsPlaying, playNewSong } = get();
    console.log("AudioStore: togglePlay called. isPlaying:", isPlaying, "audioElement:", !!audioElement);
    if (audioElement) {
      const expectedSrc = window.location.origin + currentSongSrc;
      // If src is different, treat it like playing a new song
      if (audioElement.currentSrc !== expectedSrc && !audioElement.src.endsWith(currentSongSrc)) {
        console.log("AudioStore: togglePlay - src mismatch. Calling playNewSong for", currentSongSrc);
        playNewSong(currentSongSrc); // This will set src, load, and set isPlaying:true
        return;
      }

      if (isPlaying) {
        console.log("AudioStore: togglePlay - pausing audio.");
        audioElement.pause(); // Event listener will set isPlaying: false
      } else {
        console.log("AudioStore: togglePlay - playing audio.");
        audioElement.play().catch(error => {
          console.error("AudioStore: Error in togglePlay -> play():", error);
          setIsPlaying(false); // Ensure state reflects failure
        });
        // Event listener will set isPlaying: true
      }
    } else {
      // If no audio element yet, set intent to play. NowPlaying should pick this up.
      console.warn("AudioStore: togglePlay called, audioElement is null. Setting intent to play:", !isPlaying);
      setIsPlaying(!isPlaying); // Set the desired state
    }
  },

  playNewSong: (src: string) => {
    const { audioElement, setIsPlaying } = get();
    console.log("AudioStore: playNewSong called with src:", src);
    // Set new song src and explicitly state intent to play
    set({ currentSongSrc: src, isPlaying: true }); 
    if (audioElement) {
      // If the element already exists, update its src and play
      const expectedSrc = window.location.origin + src;
      if (audioElement.currentSrc !== expectedSrc || !audioElement.src.endsWith(src)) {
        audioElement.src = src;
        audioElement.load(); // Important!
      }
      // play() will be attempted by NowPlaying's effect reacting to isPlaying:true & new src loaded via 'canplay'
      // Or we can try to play here, and NowPlaying's effect will just confirm.
      audioElement.play().catch(error => {
          console.error("AudioStore: Error in playNewSong -> play():", error);
          setIsPlaying(false);
      });
    }
  },
}));