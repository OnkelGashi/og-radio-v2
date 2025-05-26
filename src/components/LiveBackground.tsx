// src/components/LiveBackground.tsx
import React, { useRef, useEffect } from 'react';
import { useAudioStore } from '@/stores/audioStore'; // IF you create a store
                                                   // Otherwise, pass audioElement as a prop

interface LiveBackgroundProps {
  activeGenre: string | null;
  // If not using a store, add:
  // audioElement: HTMLAudioElement | null; 
  // isPlaying: boolean;
}

const LiveBackground: React.FC<LiveBackgroundProps> = ({ 
  activeGenre, 
  /* audioElement, isPlaying */ // Uncomment if passing as props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // If using a store:
  const { audioElement, isPlaying } = useAudioStore(state => ({
    audioElement: state.audioElement,
    isPlaying: state.isPlaying,
  }));

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // 1. Setup Web Audio API when audioElement is ready
  useEffect(() => {
    if (audioElement && !audioContextRef.current) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = context.createMediaElementSource(audioElement);
      const analyser = context.createAnalyser();

      analyser.fftSize = 256; // Determines detail. Power of 2.

      source.connect(analyser);
      analyser.connect(context.destination); // So you can still hear the audio

      audioContextRef.current = context;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
  }, [audioElement]);

  // 2. Drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current || !dataArrayRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      if (!analyserRef.current || !dataArrayRef.current || !ctx || !isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear if not playing
        // Optionally draw a static background based on activeGenre if not playing
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const barWidth = (canvas.width / bufferLength) * 2.0; // Make bars a bit wider
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArrayRef.current[i] * (canvas.height / 256) * 0.7; // Scale height

        // SICK PART: Genre-specific colors & simple effects
        let r=0, g=0, b=0;
        const intensity = dataArrayRef.current[i] / 255;

        switch(activeGenre) {
          case 'lofi':
            r = 255 * intensity + (100 * (1-intensity)); // Pinkish to purplish
            g = 182 * intensity + (100 * (1-intensity));
            b = 193 * intensity + (200 * (1-intensity));
            break;
          case 'electronic':
            r = 0   * intensity + (20 * (1-intensity));  // Cyan to dark blue
            g = 255 * intensity + (50 * (1-intensity));
            b = 255 * intensity + (100 * (1-intensity));
            break;
          case 'hip-hop':
            r = 255 * intensity + (50 * (1-intensity)); // Yellow/Orange to dark red
            g = 223 * intensity + (20 * (1-intensity)); // deckt auch Gelb ab
            b = 0   * intensity + (20 * (1-intensity));
            break;
          // Add more genre cases from your GenreBackground.tsx
          default:
            r = dataArrayRef.current[i] + 50 * (i/bufferLength);
            g = 100 * (i/bufferLength);
            b = 150;
        }

        ctx.fillStyle = `rgba(<span class="math-inline">\{r\},</span>{g},${b}, ${0.5 + intensity * 0.5})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        // EXTRA SICKNESS: Small glowing tops for bars
        if (barHeight > 0) {
            ctx.fillStyle = `rgba(${Math.min(255, r+50)}, ${Math.min(255, g+50)}, ${Math.min(255, b+50)}, 0.8)`;
            ctx.fillRect(x, canvas.height - barHeight - 3, barWidth, 3); // 3px "glow"
        }

        x += barWidth + 2; // Spacing between bars
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeGenre, isPlaying]); // Re-run if genre or playing state changes

  return <canvas ref={canvasRef} className="fixed inset-0 -z-20 w-full h-full transition-all duration-700" />;
};

export default LiveBackground;