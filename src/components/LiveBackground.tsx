// src/components/LiveBackground.tsx
import React, { useRef, useEffect } from 'react';
import { useAudioStore } from '@/stores/audioStore';

interface LiveBackgroundProps {
  activeGenre: string | null;
}

const LiveBackground: React.FC<LiveBackgroundProps> = ({ activeGenre }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    audioElement, 
    audioContext: audioContextFromStore, // Get AudioContext from store
    isPlaying 
  } = useAudioStore(state => ({
    audioElement: state.audioElement,
    audioContext: state.audioContext, // Make sure store provides this
    isPlaying: state.isPlaying,
  }));

  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Effect 1: Setup AnalyserNode
  useEffect(() => {
    // Ensure all necessary elements from the store are available
    if (audioElement && audioContextFromStore) {
      // Create or reuse MediaElementAudioSourceNode
      if (!sourceNodeRef.current || sourceNodeRef.current.mediaElement !== audioElement) {
        if (sourceNodeRef.current) { // Disconnect old source if mediaElement changed
          try { sourceNodeRef.current.disconnect(); } catch (e) { /* ignore */ }
        }
        try {
            sourceNodeRef.current = audioContextFromStore.createMediaElementSource(audioElement);
            console.log("LiveBackground: Created MediaElementAudioSourceNode");
        } catch (e) {
            // This can happen if the audio element is already connected to a source node in this context
            console.warn("LiveBackground: Error creating MediaElementAudioSourceNode. Already connected?", e);
            // If it's already connected, we might not need to create a new one,
            // but this visualizer needs its own analyser path.
            // For now, we'll assume this error means we should stop trying to set up analyser here.
            return; 
        }
      }

      // Create AnalyserNode if it doesn't exist
      if (!analyserRef.current && sourceNodeRef.current) {
        const analyser = audioContextFromStore.createAnalyser();
        analyser.fftSize = 256;
        try {
            sourceNodeRef.current.connect(analyser);
            // We are NOT connecting analyser to destination here,
            // assuming the main audio path is already handled.
            console.log("LiveBackground: Connected source to analyser");
        } catch(e) {
            console.error("LiveBackground: Error connecting source to analyser", e);
            return;
        }
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      }
    } else if (analyserRef.current) { // Cleanup if audio element or context is gone
      console.log("LiveBackground: Cleaning up analyser and source node.");
      if (sourceNodeRef.current) {
        try { sourceNodeRef.current.disconnect(); } catch (e) { /* ignore */ }
        sourceNodeRef.current = null;
      }
      analyserRef.current = null;
      dataArrayRef.current = null;
    }
  }, [audioElement, audioContextFromStore]); // Re-run if these change


  // Effect 2: Drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current || !dataArrayRef.current || !audioContextFromStore) {
      // Ensure canvas is cleared if visualizer isn't ready
      if(canvas && canvas.getContext('2d')) {
        const ctxClear = canvas.getContext('2d');
        if (ctxClear) ctxClear.clearRect(0,0, canvas.width, canvas.height);
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      if (!analyserRef.current || !dataArrayRef.current || !ctx) return;
      
      // Attempt to resume AudioContext if suspended and we want to play
      if (isPlaying && audioContextFromStore.state === "suspended") {
        audioContextFromStore.resume().catch(e => console.warn("LiveBackground: AudioContext resume failed during draw", e));
      }

      if (!isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      // Responsive canvas size
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeightFraction = dataArrayRef.current[i] / 255;
        const barHeight = barHeightFraction * canvas.height * 0.5;
        let r=0, g=0, b=0;
        const intensity = barHeightFraction;

        switch(activeGenre) {
          case 'lofi': r = 255 * intensity + (100 * (1-intensity)); g = 182 * intensity + (100 * (1-intensity)); b = 193 * intensity + (200 * (1-intensity)); break;
          case 'electronic': r = 0 * intensity + (20 * (1-intensity)); g = 255 * intensity + (50 * (1-intensity)); b = 255 * intensity + (100 * (1-intensity)); break;
          case 'hip-hop': r = 255 * intensity + (50 * (1-intensity)); g = 223 * intensity + (20 * (1-intensity)); b = 0 * intensity + (20 * (1-intensity)); break;
          case 'rap': r = 200 * intensity + (60 * (1-intensity)); g = 80 * intensity + (40 * (1-intensity)); b = 255 * intensity + (150 * (1-intensity)); break;
          case 'rnb': r = 255 * intensity + (80 * (1-intensity)); g = 105 * intensity + (60 * (1-intensity)); b = 180 * intensity + (120 * (1-intensity)); break;
          default: r = 60 + (intensity * 100); g = 80 + (intensity * 50); b = 180 + (intensity * 75);
        }
        
        ctx.fillStyle = `rgba(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)}, ${0.3 + intensity * 0.4})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        if (barHeight > 10 && intensity > 0.5) {
            ctx.fillStyle = `rgba(${Math.min(255, r+50)}, ${Math.min(255, g+50)}, ${Math.min(255, b+50)}, 0.3)`;
            ctx.fillRect(x, canvas.height - barHeight - 4, barWidth, 4); 
        }
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeGenre, isPlaying, audioContextFromStore, audioElement]); // Dependencies

  return <canvas ref={canvasRef} className="fixed inset-0 -z-20 w-full h-full transition-all duration-300" />;
};

export default LiveBackground;