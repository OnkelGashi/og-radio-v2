import React, { useRef, useEffect } from 'react';
import { useAudioStore } from '@/stores/audioStore'; // Assuming you implement a global audio store

interface SynestheticCanvasProps {
  activeGenre: string | null;
}

const SynestheticCanvas: React.FC<SynestheticCanvasProps> = ({ activeGenre }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Get audioElement and isPlaying from your audio store
  const { audioElement, isPlaying } = useAudioStore(state => ({ 
    audioElement: state.audioElement, 
    isPlaying: state.isPlaying 
  }));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (audioElement && !audioContextRef.current) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioElement);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Adjust for detail
      source.connect(analyser);
      analyser.connect(audioContext.destination); // Connect analyser to output

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
  }, [audioElement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current || !dataArrayRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const renderFrame = () => {
      if (!analyserRef.current || !dataArrayRef.current || !ctx || !isPlaying) {
        // Optionally clear canvas or draw a static state if not playing
        // ctx.clearRect(0, 0, canvas.width, canvas.height); 
        animationFrameId = requestAnimationFrame(renderFrame);
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- GENRE-SPECIFIC DRAWING LOGIC HERE ---
      if (activeGenre === 'lofi') {
        // Draw soft, pastel particles, etc.
        const barWidth = (canvas.width / dataArrayRef.current.length) * 2.5;
        let x = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const barHeight = dataArrayRef.current[i] / 2;
          ctx.fillStyle = `rgba(255, 182, 193, ${dataArrayRef.current[i] / 512})`; // Light pinkish
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      } else if (activeGenre === 'electronic') {
        // Draw neon lines, geometric shapes, etc.
        const barWidth = (canvas.width / dataArrayRef.current.length);
        let x = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const barHeight = dataArrayRef.current[i];
          ctx.fillStyle = `rgb(0, 255, 255)`; // Cyan
          ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
           x += barWidth + 1;
        }
      } else {
        // Default visualizer
        const barWidth = (canvas.width / dataArrayRef.current.length) * 2;
        let x = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const barHeight = dataArrayRef.current[i];
          ctx.fillStyle = `rgba(${barHeight + 100}, 50, 150, 0.7)`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      }
      // --- END GENRE-SPECIFIC ---

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
      // Consider closing audioContext if component unmounts and isn't used elsewhere
      // if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      //   audioContextRef.current.close();
      //   audioContextRef.current = null;
      // }
    };
  }, [activeGenre, audioElement, isPlaying]); // Add isPlaying to dependencies

  return <canvas ref={canvasRef} className="fixed inset-0 -z-20 w-full h-full" />;
};

export default SynestheticCanvas;