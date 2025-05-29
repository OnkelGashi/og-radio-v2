// src/components/LiveBackground.tsx
import React, { useRef, useEffect } from 'react';
import { useAudioStore } from '@/stores/audioStore';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/stores/uiStore';

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
  const nightMode = useUIStore((s) => s.nightMode);
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

      // Clear for each frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw a subtle animated gradient background
      const time = Date.now() * 0.0002;
      const grad = ctx.createLinearGradient(
        0, 0,
        canvas.width * (0.7 + 0.3 * Math.sin(time)),
        canvas.height * (0.7 + 0.3 * Math.cos(time))
      );
      if (nightMode) {
        grad.addColorStop(0, "#23243a");
        grad.addColorStop(0.5, "#181825");
        grad.addColorStop(1, "#23243a");
      } else {
        grad.addColorStop(0, "#6EE7B7");
        grad.addColorStop(0.5 + 0.2 * Math.sin(time), "#3B82F6");
        grad.addColorStop(1, "#9333EA");
      }
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      if (!analyserRef.current || !dataArrayRef.current || !ctx || !isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Static background for paused audio
        if (!isPlaying) {
          if (nightMode) {
            ctx.fillStyle = 'rgba(32, 34, 40, 0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (activeGenre === 'lofi') {
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

      // Draw glowing, rounded bars with a "liquid" effect
      const bufferLength = analyserRef.current.frequencyBinCount;
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArrayRef.current[i] * (canvas.height / 256) * 0.7;
        const intensity = dataArrayRef.current[i] / 255;

        // Colorful, genre-based gradient for bars
        let color = "#fff";
        if (nightMode) {
          color = `rgba(${60 + 120 * intensity},${60 + 120 * intensity},${120 + 80 * intensity},0.7)`;
        } else {
          switch (activeGenre) {
            case 'lofi':
              color = `rgba(${200 + 55 * intensity},${180 + 75 * intensity},${220 + 33 * intensity},0.7)`;
              break;
            case 'electronic':
              color = `rgba(${80 + 120 * intensity},${200 + 55 * intensity},${255},0.8)`;
              break;
            case 'hip-hop':
              color = `rgba(${255},${200 + 55 * intensity},${80 + 120 * intensity},0.8)`;
              break;
            default:
              color = `rgba(${100 + 155 * intensity},${100 + 155 * (1-intensity)},255,0.7)}`;
          }
        }

        // Glowing shadow
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 18 + 18 * intensity;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x, canvas.height - barHeight);
        ctx.arc(
          x + barWidth / 2,
          canvas.height - barHeight,
          barWidth / 2,
          Math.PI,
          2 * Math.PI
        );
        ctx.lineTo(x + barWidth, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Overlay a subtle highlight on top of each bar
        ctx.save();
        ctx.globalAlpha = 0.18 + 0.18 * intensity;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.ellipse(
          x + barWidth / 2,
          canvas.height - barHeight + 6,
          barWidth / 2.2,
          7,
          0,
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.restore();

        x += barWidth + 2;
      }

      // Add floating, blurred circles for extra depth
      for (let i = 0; i < 8; i++) {
        const cx = (canvas.width / 8) * i + (Math.sin(time * 2 + i) * 40);
        const cy = canvas.height * 0.3 + Math.cos(time * 2.5 + i) * 60;
        const radius = 40 + 30 * Math.abs(Math.sin(time + i));
        ctx.save();
        ctx.globalAlpha = 0.08 + 0.07 * Math.abs(Math.sin(time + i));
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = nightMode
          ? "#fff"
          : `hsl(${200 + i * 20}, 80%, 70%)`;
        ctx.shadowColor = nightMode ? "#fff" : `hsl(${200 + i * 20}, 80%, 70%)`;
        ctx.shadowBlur = 40;
        ctx.fill();
        ctx.restore();
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeGenre, isPlaying, containerWidth, containerHeight, nightMode]);

  const genreGradientMap: Record<string, string> = {
    lofi: "from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]",
    "hip-hop": "from-[#F59E42] via-[#F43F5E] to-[#6366F1]",
    electronic: "from-[#06B6D4] via-[#818CF8] to-[#F472B6]",
    rap: "from-[#FBBF24] via-[#F87171] to-[#1E293B]",
    experimental: "from-[#C084FC] via-[#F472B6] to-[#F59E42]",
    rnb: "from-pink-700/60 via-pink-400/40 to-purple-900/80",
    indie: "from-[#c7d2fe] via-[#64748b]/70 to-[#161927]/95",
    ambient: "from-sky-900/80 via-teal-800/60 to-[#161927]",
    jazz: "from-amber-700/60 via-orange-400/40 to-orange-900/80",
    rock: "from-red-900/60 via-red-900/40 to-black",
  };

  const liveBadgeGradient = nightMode
    ? "linear-gradient(90deg, #23243a 0%, #181825 100%)"
    : (activeGenre && genreGradientMap[activeGenre]) ||
      "linear-gradient(90deg, #FF0000 0%, #FF9900 100%)";

  const canvasClassName = isBackground
    ? "fixed inset-0 w-full h-full pointer-events-none z-20"
    : "w-full h-full block pointer-events-none z-20";

  return (
    <>
      <canvas ref={canvasRef} className={canvasClassName} style={{ position: "fixed", top: 0, left: 0 }} />
      {isBackground && (
        <Badge
          className="px-4 py-2 text-sm font-medium border-0 absolute bottom-4 left-4 z-30"
          style={{
            background: liveBadgeGradient,
            color: nightMode ? "#e0e0e0" : "#181818",
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