// src/components/NowPlaying.tsx
import { useState, useRef, useEffect } from "react";
import {
  Play, Pause, Heart, Share2, Volume2, Clock, X as Close,
  Youtube, Instagram, Users, MessageCircle, Music, Copy, Check
} from "lucide-react";
import { useAudioStore } from "@/stores/audioStore";

const shareLinks = [ /* ...your shareLinks ... */ ];
const pad = (n: number) => n.toString().padStart(2, "0");
const fadeInAudio = (audio: HTMLAudioElement, targetVolume = 1, seconds = 7) => {
  audio.volume = 0;
  audio.play().catch(e => console.warn("FadeInAudio play failed:", e));
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
    togglePlay,
    currentSongSrc,
    setIsPlaying: storeSetIsPlaying
  } = useAudioStore();

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

  // Effect 1: Create audio element instance and set it in the store. Add event listeners.
  // This effect runs primarily once when localAudioRef.current is available.
  useEffect(() => {
    const audio = localAudioRef.current;
    if (audio) {
      // Only set in store if it's not already this exact instance.
      if (audioElementFromStore !== audio) {
        console.log("NowPlaying Effect 1: Setting audioElement in store", audio);
        setAudioElement(audio);
      }

      const updateAudioDetails = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setProgress(audio.currentTime);
          setDuration(audio.duration);
        } else if ((audio.readyState === 0 || audio.readyState === 1) && duration !== 0) { // HAVE_NOTHING or HAVE_METADATA
          setProgress(0);
          setDuration(0);
        }
      };

      const handleAudioPlay = () => { console.log("EVENT: play"); storeSetIsPlaying(true); };
      const handleAudioPause = () => { console.log("EVENT: pause"); storeSetIsPlaying(false); };
      const handleAudioEnded = () => { console.log("EVENT: ended"); storeSetIsPlaying(false); };
      const handleAudioError = (e: Event) => { console.error("EVENT: error on audio element", (e.target as HTMLAudioElement).error); storeSetIsPlaying(false); };
      const handleCanPlay = () => {
        console.log("EVENT: canplay (duration:", audio.duration, ")");
        updateAudioDetails();
        // If store wants to play and audio is paused (e.g., after load or user interaction)
        if (useAudioStore.getState().isPlaying && audio.paused) {
          console.log("NowPlaying 'canplay': Store wants play, audio is paused. Attempting play().");
          audio.play().catch(e => {
            console.warn("NowPlaying 'canplay' event: auto-play() failed.", e);
            storeSetIsPlaying(false);
          });
        }
      };
      
      audio.addEventListener("loadedmetadata", updateAudioDetails);
      audio.addEventListener("durationchange", updateAudioDetails);
      audio.addEventListener("timeupdate", updateAudioDetails);
      audio.addEventListener("canplay", handleCanPlay);
      audio.addEventListener("play", handleAudioPlay);
      audio.addEventListener("pause", handleAudioPause);
      audio.addEventListener("ended", handleAudioEnded);
      audio.addEventListener("error", handleAudioError);

      return () => {
        console.log("NowPlaying Effect 1: Cleaning up event listeners.");
        audio.removeEventListener("loadedmetadata", updateAudioDetails);
        audio.removeEventListener("durationchange", updateAudioDetails);
        audio.removeEventListener("timeupdate", updateAudioDetails);
        audio.removeEventListener("canplay", handleCanPlay);
        audio.removeEventListener("play", handleAudioPlay);
        audio.removeEventListener("pause", handleAudioPause);
        audio.removeEventListener("ended", handleAudioEnded);
        audio.removeEventListener("error", handleAudioError);
      };
    }
  }, [localAudioRef, audioElementFromStore, setAudioElement, storeSetIsPlaying]); // Minimal stable dependencies

  // Effect 2: Sync audio element's src with currentSongSrc from the store.
  useEffect(() => {
    const audio = audioElementFromStore; // Use the element from the store
    if (audio && currentSongSrc) {
      const expectedSrc = (window.location.origin + currentSongSrc).replace(/([^:]\/)\/+/g, "$1"); // Normalize potential double slashes
      const currentAudioSrc = audio.currentSrc || audio.src;

      if (currentAudioSrc !== expectedSrc && !currentAudioSrc.endsWith(currentSongSrc)) {
        console.log(`NowPlaying Effect 2 (src sync): Updating src. Current: "${currentAudioSrc}", Expected: "${expectedSrc}" (from ${currentSongSrc})`);
        audio.src = currentSongSrc;
        audio.load(); // This is crucial and will trigger "canplay" once loaded.
      }
    }
  }, [currentSongSrc, audioElementFromStore]);

  // Effect 3: Sync play/pause state with the store.
  useEffect(() => {
    const audio = audioElementFromStore;
    if (audio && audio.readyState >= 2) { // HAVE_METADATA or more, meaning src is likely processed
      console.log(`NowPlaying Effect 3 (play/pause sync): isPlaying: ${isPlaying}, audio.paused: ${audio.paused}, audio.src: ${audio.currentSrc}`);
      if (isPlaying) {
        if (audio.paused) {
          console.log("NowPlaying Effect 3: Calling audio.play()");
          audio.play().catch(e => {
            console.warn("NowPlaying Effect 3: audio.play() failed.", e);
            // The 'pause' or 'error' event listener should update the store.
          });
        }
      } else {
        if (!audio.paused) {
          console.log("NowPlaying Effect 3: Calling audio.pause()");
          audio.pause();
        }
      }
    } else if (audio && isPlaying && audio.readyState < 2) {
        console.log("NowPlaying Effect 3: Store wants play, but audio not ready yet (readyState:", audio.readyState, "). Waiting for 'canplay'.");
    }
  }, [isPlaying, audioElementFromStore, currentSongSrc]); // currentSongSrc helps re-evaluate if src changed

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioElementFromStore && duration > 0 && !isNaN(duration)) {
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioElementFromStore.currentTime = percent * duration;
      setProgress(percent * duration);
    }
  };

  const getTime = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  useEffect(() => {
    const audio = audioElementFromStore;
    if (!audio) return;
    const checkAlarm = () => {
      if (alarmActive && !alarmTriggered && alarmTime && getTime() === alarmTime) {
        setAlarmActive(false);
        setAlarmTriggered(true);
        fadeInAudio(audio, 1, 7);
      }
    };
    const interval = setInterval(checkAlarm, 1000);
    return () => clearInterval(interval);
  }, [alarmActive, alarmTriggered, alarmTime, audioElementFromStore]);

  const formatTime = (seconds: number) => { if (isNaN(seconds) || seconds < 0) seconds = 0; const mins = Math.floor(seconds / 60); const secs = Math.floor(seconds % 60); return `${mins}:${secs.toString().padStart(2, "0")}`; };
  const handleLike = () => { setIsLiked((prev) => !prev); setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1)); };
  const shareUrl = "https://onkelgashi.de";
  const handleCopy = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1200); };

  return ( /* ... Your full original JSX starting from <> and ending with </> ... Using `togglePlay` for the play button ... */
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <audio ref={localAudioRef} preload="auto" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center"> <Volume2 className="w-5 h-5 text-white" /> </div>
              <div className="min-w-0"> <h4 className="text-white text-base truncate font-semibold"> Faded Frequencies </h4> <p className="text-gray-400 text-xs truncate"> OnkelGashi • Future Bass </p> </div>
              <div className="flex items-center ml-3">
                <div className="bg-red-600/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5 text-xs font-medium flex items-center mr-1.5"> <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 animate-pulse"></div> LIVE </div>
                <button onClick={togglePlay} className="ml-0 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-2 transition-colors" title={isPlaying ? "Pause" : "Play"} style={{ marginLeft: "0px" }} > {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />} </button>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-6">
              <div className="flex items-center text-xs bg-gray-800 px-2 py-0.5 rounded-lg text-cyan-300 font-mono mr-2">
                <Clock className="w-4 h-4 mr-1 text-cyan-400" /> <CurrentTime />
                <input type="time" value={alarmTime} onChange={e => setAlarmTime(e.target.value)} className="bg-gray-900 text-cyan-300 px-2 py-0.5 rounded-md w-24 border border-gray-700 text-xs outline-none focus:border-cyan-500 font-mono tracking-wider ml-2" style={{ minWidth: 80 }} title="Alarm Timer" />
                <button onClick={() => { if (alarmTime) { setAlarmActive(true); setAlarmTriggered(false); } }} className={`px-2 py-0.5 text-xs rounded-md ml-1 transition-colors ${ alarmActive ? "bg-cyan-700 text-white" : "bg-cyan-600 hover:bg-cyan-500 text-white" }`} > {alarmActive ? "Armed" : "Set"} </button>
                {alarmTriggered && ( <span className="ml-2 text-pink-400 font-bold animate-pulse"> OG RADIO WAKE UP! </span> )}
              </div>
              <button onClick={handleLike} className={`transition-colors flex items-center font-bold text-lg ${ isLiked ? "text-red-400 hover:text-red-300" : "text-gray-400 hover:text-white" }`} title="Like" > <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} /> <span className="ml-1 text-xs">{likeCount}</span> </button>
              <button className="text-gray-400 hover:text-white p-2 rounded-full transition-colors" onClick={() => setShowShare(true)} title="Teilen" > <Share2 className="w-5 h-5" /> </button>
            </div>
          </div>
          <div className="pb-0.5">
            <div className="w-full bg-gray-800 rounded-full h-1 cursor-pointer relative" onClick={handleSeek} >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all" style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }} />
            </div>
            <div className="text-xs text-gray-500 flex justify-end pt-0.5 pr-1"> {formatTime(progress)} / {formatTime(duration)} </div>
          </div>
        </div>
      </div>
      {showShare && ( <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center transition"> <div className="bg-[#181c32] p-8 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full relative"> <button className="absolute top-3 right-3 text-gray-500 hover:text-white" onClick={() => setShowShare(false)} > <Close className="w-6 h-6" /> </button> <h2 className="text-2xl font-bold text-white mb-3">Teilen</h2> <div className="flex flex-wrap gap-3 mb-5"> {shareLinks.map((link) => ( <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center px-3 py-2 rounded-xl hover:bg-gray-900 transition-colors text-sm font-medium ${link.color}`} > <link.icon className="w-6 h-6 mb-1" /> {link.name} </a> ))} </div> <div className="flex items-center bg-gray-800 rounded-lg p-2"> <input className="bg-transparent text-gray-300 flex-1 px-2 outline-none text-xs" value={shareUrl} readOnly /> <button className="ml-2 px-2 py-1 rounded bg-cyan-700 text-white hover:bg-cyan-600 transition" onClick={handleCopy} > {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} </button> </div> <div className="mt-3 text-xs text-gray-500"> (Du kannst den Link überall teilen) </div> </div> </div> )}
    </>
  );
};

function CurrentTime() {
  const [now, setNow] = useState(() => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; });
  useEffect(() => { const timer = setInterval(() => { const d = new Date(); setNow(`${pad(d.getHours())}:${pad(d.getMinutes())}`); }, 5000); return () => clearInterval(timer); }, []);
  return <span suppressHydrationWarning>{now}</span>;
}
export default NowPlaying;