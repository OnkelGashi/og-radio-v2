// src/components/LiveBackground.tsx
import React, { useRef, useEffect } from 'react';
import { useAudioStore } from '@/stores/audioStore';
import { Badge } from '@/components/ui/badge';

interface LiveBackgroundProps {
  activeGenre: string | null;
  isBackground?: boolean; // true for fixed background, false for dialog/fullscreen
  containerWidth?: number; // explicit width for dialog/fullscreen
  containerHeight?: number; // explicit height for dialog/fullscreen
}

const LiveBackground: React.FC<LiveBackgroundProps> = ({ 
  activeGenre, 
  isBackground = true,
  containerWidth,
  containerHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioElement, isPlaying } = useAudioStore(state => ({
    audioElement: state.audioElement,
    isPlaying: state.isPlaying,
  }));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Setup Web Audio API when audioElement is ready
  useEffect(() => {
    if (audioElement && !audioContextRef.current) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = context.createMediaElementSource(audioElement);
      const analyser = context.createAnalyser();

      analyser.fftSize = 256;

      source.connect(analyser);
      analyser.connect(context.destination);

      audioContextRef.current = context;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
    // Cleanup AudioContext on unmount or audioElement change
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [audioElement]);

  // Drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      // Set canvas dimensions
      canvas.width = containerWidth || window.innerWidth;
      canvas.height = containerHeight || window.innerHeight;

      if (!analyserRef.current || !dataArrayRef.current || !ctx || !isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Static background for paused audio
        if (!isPlaying) {
          if (activeGenre === 'lofi') {
            ctx.fillStyle = 'rgba(255, 182, 193, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (activeGenre === 'electronic') {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
            for (let i = 0; i < canvas.width; i += 50) {
              ctx.beginPath();
              ctx.moveTo(i, 0);
              ctx.lineTo(i, canvas.height);
              ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += 50) {
              ctx.beginPath();
              ctx.moveTo(0, i);
              ctx.lineTo(canvas.width, i);
              ctx.stroke();
            }
          } else if (activeGenre === 'hip-hop') {
            ctx.fillStyle = 'rgba(255, 223, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else {
            ctx.fillStyle = 'rgba(100, 50, 150, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const barWidth = (canvas.width / bufferLength) * 2.0;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArrayRef.current[i] * (canvas.height / 256) * 0.7;

        let r = 0, g = 0, b = 0;
        const intensity = dataArrayRef.current[i] / 255;

        switch (activeGenre) {
          case 'lofi':
            r = 255 * intensity + (100 * (1 - intensity));
            g = 182 * intensity + (100 * (1 - intensity));
            b = 193 * intensity + (200 * (1 - intensity));
            break;
          case 'electronic':
            r = 0 * intensity + (20 * (1 - intensity));
            g = 255 * intensity + (50 * (1 - intensity));
            b = 255 * intensity + (100 * (1 - intensity));
            break;
          case 'hip-hop':
            r = 255 * intensity + (50 * (1 - intensity));
            g = 223 * intensity + (20 * (1 - intensity));
            b = 0 * intensity + (20 * (1 - intensity));
            break;
          default:
            r = dataArrayRef.current[i] + 50 * (i / bufferLength);
            g = 100 * (i / bufferLength);
            b = 150;
        }

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.5 + intensity * 0.5})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        // Glowing tops for bars
        if (barHeight > 0) {
          ctx.fillStyle = `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)}, 0.8)`;
          ctx.fillRect(x, canvas.height - barHeight - 3, barWidth, 3);
        }

        x += barWidth + 2;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeGenre, isPlaying, containerWidth, containerHeight]);

  const genreGradientMap: Record<string, string> = {
    "hip-hop": "linear-gradient(90deg, #FF00FF 0%, #FFFF00 50%, #00CCFF 100%)",
    // Add more if needed
  };

  const liveBadgeGradient =
    (activeGenre && genreGradientMap[activeGenre]) ||
    "linear-gradient(90deg, #FF0000 0%, #FF9900 100%)";

  const canvasClassName = isBackground
    ? "fixed inset-0 -z-20 w-full h-full transition-all duration-700"
    : "w-full h-full block";

  return (
    <>
      <canvas ref={canvasRef} className={canvasClassName} />
      {isBackground && (
        <Badge
          className="px-4 py-2 text-sm font-medium border-0 absolute bottom-4 left-4"
          style={{
            background: liveBadgeGradient,
            color: "#181818",
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          LIVE
        </Badge>
      )}
    </>
  );
};

export default LiveBackground;