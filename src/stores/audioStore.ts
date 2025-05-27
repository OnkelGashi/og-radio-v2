// src/stores/audioStore.ts
import { create } from 'zustand';

export interface NowPlayingInfo {
  id: string;
  type: 'track' | 'station' | 'playlist' | 'welcome';
  src: string;
  title: string;
  artistOrContext: string;
  genre: string | null;
  artwork?: string;
}

interface AudioState {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  nowPlayingInfo: NowPlayingInfo | null;
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
}

// Corrected paths based on your public folder structure:
export const WELCOME_AUDIO_INFO: NowPlayingInfo = {
  id: 'welcome_track',
  type: 'welcome',
  src: "/audio/welcome/Welcome.mp3",
  title: "Welcome to OG Radio",
  artistOrContext: "OnkelGashi",
  genre: null,
};

export const DEFAULT_TRACK_INFO: NowPlayingInfo = {
  id: 'default_track_faded_frequencies',
  type: 'track',
  src: "/audio/default/faded-frequencies.mp3",
  title: "Faded Frequencies",
  artistOrContext: "OnkelGashi",
  genre: "Future Bass",
};

export const useAudioStore = create<AudioState>((set, get) => ({
  audioElement: null,
  isPlaying: false,
  nowPlayingInfo: null,
  isWelcomeAudioPlaying: false,
  volume: 1,
  activeGenreForTheme: null,

  setAudioElement: (element) => {
    console.log("AudioStore: Setting audioElement", element);
    const { volume } = get();
    if (element) {
      element.volume = volume;
    }
    set({ audioElement: element });
  },

  setActiveGenreForTheme: (genre) => {
    console.log("AudioStore: Setting activeGenreForTheme", genre);
    set({ activeGenreForTheme: genre });
  },

  playItem: (itemInfo) => {
    console.log("AudioStore: playItem called with:", itemInfo);
    const { audioElement, volume, setActiveGenreForTheme, nowPlayingInfo: currentItem } = get();

    if (!audioElement) {
      console.error("AudioStore: audioElement is null in playItem. Cannot play.");
      set({
        nowPlayingInfo: itemInfo,
        isPlaying: true,
        isWelcomeAudioPlaying: itemInfo.type === 'welcome',
        activeGenreForTheme: itemInfo.genre
      });
      return;
    }

    console.log(`AudioStore: Preparing to play ${itemInfo.title} (src: ${itemInfo.src})`);
    audioElement.pause();

    set({
      nowPlayingInfo: itemInfo,
      isPlaying: false,
      isWelcomeAudioPlaying: itemInfo.type === 'welcome',
    });
    setActiveGenreForTheme(itemInfo.genre);

    audioElement.src = itemInfo.src;
    audioElement.volume = volume;
    audioElement.onended = null;

    const playPromise = audioElement.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log(`AudioStore: Playback started successfully for: ${itemInfo.title}`);
        set({ isPlaying: true });

        if (itemInfo.type === 'welcome') {
          console.log("AudioStore: Welcome audio playing, setting up onended for default track.");
          audioElement.onended = () => {
            console.log("AudioStore: Welcome audio ended. Playing default track.");
            if (audioElement) audioElement.onended = null;
            get().playItem(DEFAULT_TRACK_INFO);
          };
        }
      }).catch(error => {
        console.error(`AudioStore: Error playing ${itemInfo.title} (src: ${itemInfo.src}):`, error);
        set({ isPlaying: false, isWelcomeAudioPlaying: false, nowPlayingInfo: currentItem });
      });
    } else {
      console.warn("AudioStore: audioElement.play() did not return a promise.");
      set({ isPlaying: true });
      if (itemInfo.type === 'welcome') {
        audioElement.onended = () => {
          if (audioElement) audioElement.onended = null;
          get().playItem(DEFAULT_TRACK_INFO);
        };
      }
    }
  },

  playWelcomeAndThenDefault: () => {
    console.log("AudioStore: playWelcomeAndThenDefault called");
    get().playItem(WELCOME_AUDIO_INFO);
  },

  pauseAllAudio: () => {
    console.log("AudioStore: pauseAllAudio called");
    const { audioElement } = get();
    if (audioElement && !audioElement.paused) {
      audioElement.pause();
    }
    set({ isPlaying: false, isWelcomeAudioPlaying: false });
  },

  togglePlayPause: () => {
    const { isPlaying, nowPlayingInfo, playItem, pauseAllAudio } = get();
    console.log("AudioStore: togglePlayPause called. isPlaying:", isPlaying, "nowPlayingInfo:", nowPlayingInfo);

    if (isPlaying) {
      pauseAllAudio();
    } else {
      if (nowPlayingInfo && nowPlayingInfo.src) {
        console.log("AudioStore: Resuming/Starting item:", nowPlayingInfo);
        playItem(nowPlayingInfo);
      } else {
        console.log("AudioStore: No current item, playing default track.");
        playItem(DEFAULT_TRACK_INFO);
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
    console.log("AudioStore: Volume set to", newVolume);
  },
}));