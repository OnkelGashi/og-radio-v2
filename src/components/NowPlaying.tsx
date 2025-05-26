// src/components/NowPlaying.tsx
import { useState, useRef, useEffect } from "react";
import {
  Play, Pause, Heart, Share2, Volume2, Clock, X as Close,
  Youtube, Instagram, Users, MessageCircle, Music, Copy, Check
} from "lucide-react";
import { useAudioStore } from "@/stores/audioStore"; // Import the store

// --- Config ---
const shareLinks = [ /* ...your existing shareLinks array... */ ];

// Utility
const pad = (n: number) => n.toString().padStart(2, "0");
const fadeInAudio = (audio: HTMLAudioElement, targetVolume = 1, seconds = 7) => {
  audio.volume = 0;
  audio.play(); // fadeInAudio will attempt to play
  let step = 0;
  const steps = seconds * 10;
  const interval = setInterval(() => {
    step += 1;
    audio.volume = Math.min(targetVolume, step / steps);
    if (audio.volume >= targetVolume) clearInterval(interval);
  }, 100);
};

const NowPlaying = () => {
  const {
    audioElement: audioElementFromStore,
    setAudioElement,
    isPlaying,
    togglePlay, // Use this for the play/pause button
    currentSongSrc,
    // Get the direct setter for event handlers to avoid re-fetching state in handlers
    setIsPlaying: storeSetIsPlaying
  } = useAudioStore();

  // Local states for UI elements not directly tied to audio playback core
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(202);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [alarmTime, setAlarmTime] = useState("");
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  // Effect 1: Initialize audio element in store and set up event listeners.
  useEffect(() => {
    const audio = localAudioRef.current;
    if (audio) {
      if (audioElementFromStore !== audio) {
        setAudioElement(audio); // Set the audio element in the store
      }

      // Ensure src is set based on the store's currentSongSrc
      if (!audio.src || !audio.src.endsWith(currentSongSrc)) {
        audio.src = currentSongSrc;
        audio.load(); // Load the new source
      }

      const updateProgressAndDuration = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setProgress(audio.currentTime);
          setDuration(audio.duration);
        } else {
          setProgress(0);
          setDuration(0);
        }
      };

      // Event handlers that update the store
      const handleAudioPlay = () => storeSetIsPlaying(true);
      const handleAudioPauseOrEnded = () => storeSetIsPlaying(false);
      const handleAudioError = () => {
        console.error("Audio Element Error:", audio.error);
        storeSetIsPlaying(false);
      };

      audio.addEventListener("timeupdate", updateProgressAndDuration);
      audio.addEventListener("loadedmetadata", updateProgressAndDuration);
      audio.addEventListener("play", handleAudioPlay);
      audio.addEventListener("pause", handleAudioPauseOrEnded);
      audio.addEventListener("ended", handleAudioPauseOrEnded);
      audio.addEventListener("error", handleAudioError);

      // Attempt to play if store says isPlaying and audio is paused (e.g., after src change or initial load)
      // This will respect browser autoplay policies if audioContext is not yet active
      if (useAudioStore.getState().isPlaying && audio.paused) {
        audio.play().catch(e => {
          console.warn("NowPlaying (Effect 1): audio.play() failed. User interaction likely needed.", e);
          storeSetIsPlaying(false); // Update store if play fails
        });
      }

      return () => {
        audio.removeEventListener("timeupdate", updateProgressAndDuration);
        audio.removeEventListener("loadedmetadata", updateProgressAndDuration);
        audio.removeEventListener("play", handleAudioPlay);
        audio.removeEventListener("pause", handleAudioPauseOrEnded);
        audio.removeEventListener("ended", handleAudioPauseOrEnded);
        audio.removeEventListener("error", handleAudioError);
      };
    }
  }, [localAudioRef, setAudioElement, audioElementFromStore, storeSetIsPlaying, currentSongSrc]);


  // Effect 2: React to changes in `isPlaying` from the store or `currentSongSrc`
  // This effect ensures the HTML audio element's state (play/pause) matches the store.
  useEffect(() => {
    const audio = audioElementFromStore; // Use the element from the store
    if (audio) {
      // Sync source if it changed in the store
      if (audio.currentSrc !== window.location.origin + currentSongSrc && currentSongSrc) {
        console.log("NowPlaying (Effect 2): Song source changed in store, updating HTML element.");
        audio.src = currentSongSrc;
        audio.load();
        // If it was supposed to be playing, it will attempt to play after loading.
        // The 'play' event will then update the store via Effect 1's listener.
        if (isPlaying) {
            // Let the load event and subsequent play event handle isPlaying,
            // or play directly if confident about user interaction.
            // For now, rely on the 'play' event listener set up in Effect 1.
            // Or, more directly:
            audio.play().catch(e => {
                console.warn("NowPlaying (Effect 2): audio.play() after src change failed.", e);
                storeSetIsPlaying(false);
            });
        }
        return; // Exit because src is changing, further actions will happen on 'loadedmetadata' or 'play'
      }

      // Sync play/pause state
      if (isPlaying) {
        if (audio.paused) {
          audio.play().catch(e => {
            console.warn("NowPlaying (Effect 2): audio.play() failed.", e);
            storeSetIsPlaying(false); // Correct store state if play fails
          });
        }
      } else {
        if (!audio.paused) {
          audio.pause();
        }
      }
    }
  }, [isPlaying, audioElementFromStore, currentSongSrc, storeSetIsPlaying]);


  // Seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioElementFromStore && duration) {
      audioElementFromStore.currentTime = percent * duration;
      setProgress(percent * duration); // Optimistically update UI
    }
  };

  // Timer/Alarm
  const getTime = () => {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  useEffect(() => {
    const checkAlarm = () => {
      if (alarmActive && !alarmTriggered && alarmTime && getTime() === alarmTime) {
        setAlarmActive(false);
        setAlarmTriggered(true);
        if (audioElementFromStore) {
          fadeInAudio(audioElementFromStore, 1, 7);
          // fadeInAudio calls play(), which should trigger 'play' event & update store
        }
        setTimeout(() => setAlarmTriggered(false), 20000);
      }
    };
    const interval = setInterval(checkAlarm, 1000);
    return () => clearInterval(interval);
  }, [alarmActive, alarmTriggered, alarmTime, audioElementFromStore]);


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLike = () => { /* Your existing like logic */
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const shareUrl = "https://www.youtube.com/@OnkelGashiMusic"; // Example URL
  const handleCopy = () => { /* Your existing copy logic */
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // --- THIS IS YOUR ORIGINAL JSX STRUCTURE ---
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <audio ref={localAudioRef} preload="auto" /> {/* src will be set by useEffect */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* TOP BAR */}
          <div className="flex items-center justify-between py-2">
            {/* Left: Track Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-base truncate font-semibold">
                  Faded Frequencies
                </h4>
                <p className="text-gray-400 text-xs truncate">
                  OnkelGashi • Future Bass
                </p>
              </div>
              {/* LIVE + PLAY */}
              <div className="flex items-center ml-3">
                <div className="bg-red-600/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5 text-xs font-medium flex items-center mr-1.5">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  LIVE
                </div>
                <button
                  onClick={togglePlay} // Use togglePlay from store
                  className="ml-0 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-2 transition-colors"
                  title={isPlaying ? "Pause" : "Play"}
                  style={{ marginLeft: "0px" }}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Right: CLOCK/TIMER, Like, Share */}
            <div className="flex items-center gap-4 ml-6">
              {/* Clock/Timer */}
              <div className="flex items-center text-xs bg-gray-800 px-2 py-0.5 rounded-lg text-cyan-300 font-mono mr-2">
                <Clock className="w-4 h-4 mr-1 text-cyan-400" />
                <CurrentTime />
                <input
                  type="time"
                  value={alarmTime}
                  onChange={e => setAlarmTime(e.target.value)}
                  className="bg-gray-900 text-cyan-300 px-2 py-0.5 rounded-md w-24 border border-gray-700 text-xs outline-none focus:border-cyan-500 font-mono tracking-wider ml-2"
                  style={{ minWidth: 80 }}
                  title="Alarm Timer"
                />
                <button
                  onClick={() => {
                    if (alarmTime) {
                      setAlarmActive(true);
                      setAlarmTriggered(false);
                    }
                  }}
                  className={`px-2 py-0.5 text-xs rounded-md ml-1 transition-colors ${
                    alarmActive
                      ? "bg-cyan-700 text-white"
                      : "bg-cyan-600 hover:bg-cyan-500 text-white"
                  }`}
                >
                  {alarmActive ? "Armed" : "Set"}
                </button>
                {alarmTriggered && (
                  <span className="ml-2 text-pink-400 font-bold animate-pulse">
                    OG RADIO WAKE UP!
                  </span>
                )}
              </div>
              {/* Like counter */}
              <button
                onClick={handleLike}
                className={`transition-colors flex items-center font-bold text-lg ${
                  isLiked ? "text-red-400 hover:text-red-300" : "text-gray-400 hover:text-white"
                }`}
                title="Like"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                <span className="ml-1 text-xs">{likeCount}</span>
              </button>
              {/* Share */}
              <button
                className="text-gray-400 hover:text-white p-2 rounded-full transition-colors"
                onClick={() => setShowShare(true)}
                title="Teilen"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pb-0.5">
            <div
              className="w-full bg-gray-800 rounded-full h-1 cursor-pointer relative"
              onClick={handleSeek}
            >
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all"
                style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
              />
            </div>
            <div className="text-xs text-gray-500 flex justify-end pt-0.5 pr-1">
              {formatTime(progress)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>

      {/* --- SHARE MODAL --- */}
      {showShare && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center transition">
          <div className="bg-[#181c32] p-8 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-white"
              onClick={() => setShowShare(false)}
            >
              <Close className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-3">Teilen</h2>
            <div className="flex flex-wrap gap-3 mb-5">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center px-3 py-2 rounded-xl hover:bg-gray-900 transition-colors text-sm font-medium ${link.color}`}
                >
                  <link.icon className="w-6 h-6 mb-1" />
                  {link.name}
                </a>
              ))}
            </div>
            {/* Copy-to-clipboard */}
            <div className="flex items-center bg-gray-800 rounded-lg p-2">
              <input
                className="bg-transparent text-gray-300 flex-1 px-2 outline-none text-xs"
                value={shareUrl}
                readOnly
              />
              <button
                className="ml-2 px-2 py-1 rounded bg-cyan-700 text-white hover:bg-cyan-600 transition"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              (Du kannst den Link überall teilen)
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Live-updating clock (updates every 5 sec)
function CurrentTime() {
  const [now, setNow] = useState(() => {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setNow(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return <span suppressHydrationWarning>{now}</span>;
}

export default NowPlaying;