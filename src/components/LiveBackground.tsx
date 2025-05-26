// src/components/LiveBackground.tsx
import React, { useRef, useEffect } from 'react';
import { useAudioStore } from '@/stores/audioStore';

interface LiveBackgroundProps {
  activeGenre: string | null;
}

const LiveBackground: React.FC<LiveBackgroundProps> = ({ activeGenre }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioElement, isPlaying } = useAudioStore(state => ({
    audioElement: state.audioElement,
    isPlaying: state.isPlaying,
  }));

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (audioElement && !audioContextRef.current) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = context.createMediaElementSource(audioElement);
      const analyser = context.createAnalyser();
      
      analyser.fftSize = 256; // Lower for less detail but better performance
      
      source.connect(analyser);
      analyser.connect(context.destination);

      audioContextRef.current = context;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
    // No cleanup for audioContext here, as it's tied to the audioElement's lifecycle
    // which is managed by NowPlaying and the store.
  }, [audioElement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current || !dataArrayRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      if (!analyserRef.current || !dataArrayRef.current || !ctx || !isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Optionally: Draw a static, genre-based background when not playing
        // This can reuse logic from your original GenreBackground.tsx if desired,
        // adapted for canvas. For simplicity, we'll just clear it.
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      canvas.width = window.innerWidth; // Responsive canvas
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const barWidth = (canvas.width / bufferLength) * 1.5; // Make bars slightly wider
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeightFraction = dataArrayRef.current[i] / 255; // Normalize to 0-1
        const barHeight = barHeightFraction * canvas.height * 0.5; // Max 50% of screen height

        let r=0, g=0, b=0;
        const intensity = barHeightFraction;

        switch(activeGenre) {
          case 'lofi':
            r = 255 * intensity + (100 * (1-intensity)); 
            g = 182 * intensity + (100 * (1-intensity));
            b = 193 * intensity + (200 * (1-intensity));
            break;
          case 'electronic':
            r = 0   * intensity + (20 * (1-intensity));  
            g = 255 * intensity + (50 * (1-intensity));
            b = 255 * intensity + (100 * (1-intensity));
            break;
          case 'hip-hop':
            r = 255 * intensity + (50 * (1-intensity)); 
            g = 223 * intensity + (20 * (1-intensity)); 
            b = 0   * intensity + (20 * (1-intensity));
            break;
          case 'rap':
            r = 200 * intensity + (60 * (1-intensity));
            g = 80 * intensity + (40 * (1-intensity));
            b = 255 * intensity + (150 * (1-intensity));
            break;
          case 'rnb':
            r = 255 * intensity + (80 * (1-intensity));
            g = 105 * intensity + (60 * (1-intensity));
            b = 180 * intensity + (120 * (1-intensity));
            break;
          // Add more cases based on your textColors.ts or GenreBackground.tsx logic
          default: // Default OG Radio colors (blue/purpleish)
            r = 60 + (dataArrayRef.current[i]/255 * 100);
            g = 80 + (dataArrayRef.current[i]/255 * 50);
            b = 180 + (dataArrayRef.current[i]/255 * 75) ;
        }
        
        ctx.fillStyle = `rgba(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)}, ${0.3 + intensity * 0.4})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        if (barHeight > 10 && intensity > 0.5) { // Add "glow" only for more intense bars
            ctx.fillStyle = `rgba(${Math.min(255, r+50)}, ${Math.min(255, g+50)}, ${Math.min(255, b+50)}, 0.3)`;
            ctx.fillRect(x, canvas.height - barHeight - 4, barWidth, 4); 
        }
        x += barWidth + 1; // Spacing
      }
    };

    if (audioElement && isPlaying) { // Only start drawing if audio is ready and supposed to be playing
        if (audioContextRef.current?.state === "suspended") {
            audioContextRef.current.resume();
        }
        draw();
    } else {
        // Ensure canvas is cleared if we stop playing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }


    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeGenre, audioElement, isPlaying]);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-20 w-full h-full transition-all duration-300" />;
};

export default LiveBackground;