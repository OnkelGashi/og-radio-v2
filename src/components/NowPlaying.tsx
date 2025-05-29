// src/components/NowPlaying.tsx
import { useState, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  Heart,
  Share2,
  Volume2,
  Volume1,
  VolumeX,
  Clock,
  X as Close,
  Youtube,
  Instagram,
  Users,
  MessageCircle,
  Music,
  Copy,
  Check,
  Radio,
} from "lucide-react";
import { useAudioStore, NowPlayingInfo, EMPTY_NOW_PLAYING_INFO } from "@/stores/audioStore";
import { useUIStore } from "@/stores/uiStore";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner"; // Make sure this is imported
import NightModeToggle from "@/components/NightModeToggle";
import Equalizer from "@/components/Equalizer";

const shareLinks = [
  { name: "WhatsApp", icon: MessageCircle, color: "bg-green-500/10 text-green-500", url: "https://wa.me/?text=https://onkelgashi.de" },
  { name: "Facebook", icon: Users, color: "bg-blue-500/10 text-blue-500", url: "https://facebook.com/sharer/sharer.php?u=https://onkelgashi.de" },
  { name: "Reddit", icon: Music, color: "bg-orange-500/10 text-orange-500", url: "https://reddit.com/submit?url=https://onkelgashi.de" },
  { name: "YouTube", icon: Youtube, color: "bg-red-500/10 text-red-500", url: "https://www.youtube.com/@OnkelGashiMusic" },
  { name: "Instagram", icon: Instagram, color: "bg-pink-500/10 text-pink-500", url: "https://instagram.com/onkelgashi" },
  { name: "Twitch", icon: Users, color: "bg-purple-500/10 text-purple-400", url: "https://twitch.tv/onkelgashi" },
  { name: "TikTok", icon: Music, color: "bg-black/10 text-black", url: "https://tiktok.com/@onkelgashi" },
  { name: "Discord", icon: MessageCircle, color: "bg-indigo-500/10 text-indigo-400", url: "https://discord.gg/zsXM4w4B69" },
];

const pad = (n: number) => n.toString().padStart(2, "0");

const NowPlaying = () => {
  const store = useAudioStore();
  const {
    audioElement,
    isPlaying,
    nowPlayingInfo,
    lastPlayedInfo, // <-- Make sure to get lastPlayedInfo
    togglePlayPause: togglePlayPauseAction, // Rename for clarity
    volume,
    setVolume,
    playItem,
  } = store;

  const nightMode = useUIStore((s) => s.nightMode);
 const [showEqualizer, setShowEqualizer] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [previousVolume, setPreviousVolume] = useState(0.5);
  
  // CRITICAL CHANGE HERE:
  // nowPlayingInfo from the store is guaranteed to be an object (defaults to EMPTY_NOW_PLAYING_INFO).
  // So, direct assignment is fine.
  const displayInfo = nowPlayingInfo; 

  useEffect(() => {
    if (!audioElement) {
      setProgress(0); setDuration(0); return;
    }
    const updateTimes = () => {
      if (audioElement) {
        setProgress(audioElement.currentTime);
        setDuration(audioElement.duration || 0);
      }
    };
    // Check if metadata is already loaded
    if (audioElement.readyState >= 2 && audioElement.duration && !isNaN(audioElement.duration)) { 
        updateTimes(); 
    }
    
    audioElement.addEventListener("timeupdate", updateTimes);
    audioElement.addEventListener("loadedmetadata", updateTimes);
    audioElement.addEventListener("durationchange", updateTimes);
    audioElement.addEventListener("emptied", () => { setProgress(0); setDuration(0); });
    audioElement.addEventListener("error", (e) => { 
        console.error("NowPlaying: Audio Error", e); 
        setProgress(0); 
        setDuration(0); 
        // Consider if store.pauseAllAudio() or store.stopPlayback() should be called on error
        // store.stopPlayback(); // This would reset UI to "Ready to Play"
    });
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", updateTimes);
        audioElement.removeEventListener("loadedmetadata", updateTimes);
        audioElement.removeEventListener("durationchange", updateTimes);
        audioElement.removeEventListener("emptied", updateTimes); // Use updateTimes or a reset function
        audioElement.removeEventListener("error", updateTimes); // Use updateTimes or a reset function
      }
    };
  }, [audioElement, displayInfo?.src]); // Depend on displayInfo.src to re-run if track changes

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioElement || !duration || isNaN(duration) || duration === 0) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioElement.currentTime = percent * duration;
  };

  const [alarmTime, setAlarmTime] = useState("");
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const getTime = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  
  useEffect(() => {
    const checkAlarm = () => {
      // Current time in HH:MM, e.g., "15:07"
      const currentTime = new Date().toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' });

      // Alarm fires only if set, not already triggered, and time matches
      if (alarmActive && !alarmTriggered && alarmTime === currentTime) {
        setAlarmActive(false);
        setAlarmTriggered(true);

        if (lastPlayedInfo && lastPlayedInfo.src) {
          playItem(lastPlayedInfo);
          toast("Alarm Triggered!", {
            description: `Resuming "${lastPlayedInfo.title}".`,
            className: "bg-green-500 text-white"
          });
        } else {
          toast("Alarm Trigger Failed", {
            description: "No recent station or track found.",
            className: "bg-red-500 text-white"
          });
        }

        // Allow alarm to be used again after 60 seconds
        setTimeout(() => setAlarmTriggered(false), 60000);
      }
    };

    const interval = setInterval(checkAlarm, 1000);
    return () => clearInterval(interval);
  }, [alarmActive, alarmTriggered, alarmTime, lastPlayedInfo, playItem]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const [isLiked, setIsLiked] = useState(false);
  // const [likeCount, setLikeCount] = useState(202); // Like count can be managed differently if needed
  const handleLike = () => { setIsLiked((prev) => !prev); /* setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1)); */ };
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://onkelgashi.de";
  const handleCopy = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1200); };

  const handleVolumeChange = (newSliderValue: number[]) => {
    const newAudioVolume = newSliderValue[0] / 100;
    setVolume(newAudioVolume);
    if (newAudioVolume > 0) {
      setPreviousVolume(newAudioVolume);
    }
  };

  const sliderValue = useMemo(() => [Math.round(volume * 100)], [volume]);

  const toggleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolume(0);
    } else {
      setVolume(previousVolume);
    }
  };

  // Ensure displayInfo is always defined before accessing its properties
  const currentTitle = displayInfo?.title || "Radio";
  const currentArtistOrContext = displayInfo?.artistOrContext || "Standby";
  const currentGenre = displayInfo?.genre || "";
  const currentType = displayInfo?.type || "none";

  // Custom play/pause handler to scroll if nothing is loaded
  const handleTogglePlayPause = () => {
    if (
      !isPlaying &&
      (nowPlayingInfo?.type === "none" || !nowPlayingInfo?.src) &&
      !lastPlayedInfo
    ) {
      const section = document.getElementById("genre-stations-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Optionally: show a toast here to guide the user
    } else {
      togglePlayPauseAction();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (
        e.code === "Space" &&
        !(document.activeElement && ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName))
      ) {
        e.preventDefault();
        handleTogglePlayPause();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleTogglePlayPause]);

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-800
  bg-black/90 backdrop-blur-sm
`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <Button onClick={toggleMute} variant="ghost" size="icon" className="text-gray-400 hover:text-white w-6 h-6 sm:w-7 sm:h-7 p-1">
                  {volume === 0 ? <VolumeX className="w-full h-full" /> : volume < 0.5 ? <Volume1 className="w-full h-full" /> : <Volume2 className="w-full h-full" />}
                </Button>
                <Slider
                  value={sliderValue}
                  max={100}
                  step={1}
                  className={cn("w-[50px] sm:w-[60px] md:w-[100px]")}
                  onValueChange={handleVolumeChange}
                  aria-label="Volume"
                />
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                {currentType === 'station' ? <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              </div>
              <div className="min-w-0 flex-grow">
                <h4 className="text-white text-sm md:text-base truncate font-semibold">
                  {currentTitle}
                </h4>
                <p className="text-gray-400 text-xs truncate">
                  {currentArtistOrContext}
                  {currentGenre && ` • ${currentGenre}`}
                </p>
              </div>
              <div className="flex items-center ml-1 md:ml-3 shrink-0 gap-2">
                <div className="hidden sm:flex bg-red-600/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5 text-xs font-medium items-center mr-1.5 shrink-0">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 md:mr-2 animate-pulse"></div>
                  LIVE
                </div>
                <NightModeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-cyan-400 hover:text-white w-7 h-7 p-1"
                  onClick={() => setShowEqualizer(true)}
                  aria-label="Equalizer"
                >
                  <Music className="w-full h-full" />
                </Button>
                <Button
                  onClick={handleTogglePlayPause}
                  variant="default"
                  size="icon"
                  className="ml-0 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-1 sm:p-2 w-8 h-8 sm:w-auto sm:h-auto"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                </Button>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 ml-4">
              <div className="flex items-center text-xs bg-gray-800 px-2 py-0.5 rounded-lg text-cyan-300 font-mono">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-cyan-400" />
                <CurrentTime />
                <input
                  type="time" value={alarmTime} onChange={(e) => setAlarmTime(e.target.value)}
                  className="bg-transparent text-cyan-300 px-1 sm:px-2 py-0.5 rounded-md w-20 sm:w-24 border-none text-xs outline-none focus:ring-0 font-mono tracking-wider ml-1 sm:ml-2"
                  style={{ minWidth: 70 }} title="Alarm Timer"
                />
                <Button
                  onClick={() => {
                    if (!alarmTime) return; // Don't do anything if no time selected

                    if (!lastPlayedInfo || !lastPlayedInfo.src) {
                      // Show toast or popup message
                      toast("Choose Your WakeupMusic!", {
                        description: "Bitte wähle zuerst einen Sender oder Track aus.",
                        className: "bg-yellow-500 text-black"
                      });
                      // Scroll to genre stations section
                      const section = document.getElementById("genre-stations-section");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                      return; // Prevent arming the alarm
                    }

                    setAlarmActive(true);
                    setAlarmTriggered(false);
                  }}
                  size="xs"
                  className={`px-1.5 sm:px-2 py-0.5 text-xs rounded-md ml-1 transition-colors ${alarmActive ? "bg-cyan-700 text-white" : "bg-cyan-600 hover:bg-cyan-500 text-white"}`}
                >
                  {alarmActive ? "Armed" : "Set"}
                </Button>
                {alarmTriggered && <span className="ml-2 text-pink-400 font-bold animate-pulse text-xs">WAKE UP!</span>}
              </div>
              <Button variant="ghost" size="icon" onClick={handleLike} title="Like" className={`transition-colors flex items-center font-bold text-lg w-7 h-7 p-1 ${isLiked ? "text-red-400 hover:text-red-300" : "text-gray-400 hover:text-white"}`}>
                <Heart className={`w-full h-full ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white w-7 h-7 p-1" onClick={() => setShowShare(true)} title="Teilen">
                <Share2 className="w-full h-full" />
              </Button>
            </div>
          </div>
          <div className="pb-0.5">
            <div className="w-full bg-gray-800 rounded-full h-1 cursor-pointer relative" onClick={handleSeek}>
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all"
                style={{ width: (duration && !isNaN(duration) && duration > 0 && progress >= 0) ? `${(progress / duration) * 100}%` : "0%" }}
              />
            </div>
            <div className="text-xs text-gray-500 flex justify-end pt-0.5 pr-1">
              {formatTime(progress)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
      {showShare && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-100" onClick={() => setShowShare(false)}>
            <div className="bg-[#181c32] p-6 sm:p-8 rounded-2xl border border-gray-700 shadow-2xl max-w-xs sm:max-w-md w-full relative mx-4" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-gray-500 hover:text-white w-7 h-7 p-1" onClick={() => setShowShare(false)}>
                    <Close className="w-full h-full" />
                </Button>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Teilen via</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                    {shareLinks.map((link) => (
                        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                           className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl hover:opacity-80 transition-opacity text-xs sm:text-sm font-medium ${link.color} aspect-square`}>
                            <link.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            {link.name}
                        </a>
                    ))}
                </div>
                <div className="flex items-center bg-gray-800 rounded-lg p-2">
                    <input className="bg-transparent text-gray-300 flex-1 px-2 outline-none text-xs" value={shareUrl} readOnly />
                    <Button size="sm" className="ml-2 px-3 py-1 rounded bg-cyan-700 text-white hover:bg-cyan-600 transition" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
                <div className="mt-3 text-xs text-center text-gray-500">(Link kopieren und überall teilen)</div>
            </div>
        </div>
      )}
      {showEqualizer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowEqualizer(false)}>
          <div className="bg-[#181c32] p-6 rounded-2xl border border-gray-700 shadow-2xl max-w-lg w-full relative mx-4" onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-gray-500 hover:text-white w-7 h-7 p-1" onClick={() => setShowEqualizer(false)}>
              <Close className="w-full h-full" />
            </Button>
            <h2 className="text-xl font-bold text-white mb-4">Equalizer</h2>
            <Equalizer />
          </div>
        </div>
      )}
    </>
  );
};

function CurrentTime() {
  const [now, setNow] = useState(() => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; });
  useEffect(() => {
    const timer = setInterval(() => { const d = new Date(); setNow(`${pad(d.getHours())}:${pad(d.getMinutes())}`); }, 5000); // Update every 5 seconds
    return () => clearInterval(timer);
  }, []);
  return <span suppressHydrationWarning>{now}</span>;
}

export default NowPlaying;