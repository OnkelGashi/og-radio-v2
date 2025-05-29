import React, { useEffect, useRef, useState } from "react";
import { useAudioStore } from "@/stores/audioStore";

// 10-band EQ frequencies (ISO standard)
const bands = [
  { freq: 31, label: "31Hz" },
  { freq: 62, label: "62Hz" },
  { freq: 125, label: "125Hz" },
  { freq: 250, label: "250Hz" },
  { freq: 500, label: "500Hz" },
  { freq: 1000, label: "1kHz" },
  { freq: 2000, label: "2kHz" },
  { freq: 4000, label: "4kHz" },
  { freq: 8000, label: "8kHz" },
  { freq: 16000, label: "16kHz" },
];

const sliderColors = [
  "from-blue-500 to-blue-300",
  "from-cyan-500 to-cyan-300",
  "from-green-500 to-green-300",
  "from-lime-500 to-lime-300",
  "from-yellow-500 to-yellow-300",
  "from-orange-500 to-orange-300",
  "from-pink-500 to-pink-300",
  "from-purple-500 to-purple-300",
  "from-indigo-500 to-indigo-300",
  "from-red-500 to-red-300",
];

const Equalizer: React.FC = () => {
  const audioContext = useAudioStore((s) => s.audioContext);
  const mediaElementSource = useAudioStore((s) => s.mediaElementSource);
  const [gains, setGains] = useState(Array(bands.length).fill(0));
  const filtersRef = useRef<BiquadFilterNode[]>([]);

  // Setup EQ chain
  useEffect(() => {
    if (!audioContext || !mediaElementSource) return;

    // Clean up previous filters (disconnect only filters, not mediaElementSource)
    filtersRef.current.forEach((f) => f.disconnect());
    filtersRef.current = [];

    // Create filters
    const filters = bands.map((band, i) => {
      const filter = audioContext.createBiquadFilter();
      filter.type = "peaking";
      filter.frequency.value = band.freq;
      filter.Q.value = 1.1;
      filter.gain.value = gains[i];
      return filter;
    });

    // Chain filters
    filters.reduce((prev, curr) => {
      prev.connect(curr);
      return curr;
    });

    // Connect mediaElementSource to first filter, last filter to destination
    try {
      // Only disconnect from previous filter chain if needed, but never from destination
      // Do NOT call mediaElementSource.disconnect() here!
    } catch {}
    mediaElementSource.connect(filters[0]);
    filters[filters.length - 1].connect(audioContext.destination);
    filtersRef.current = filters;

    return () => {
      // Only disconnect filters from each other and from destination
      filters.forEach((f) => f.disconnect());
      // Do NOT disconnect mediaElementSource from anything here!
    };
    // eslint-disable-next-line
  }, [audioContext, mediaElementSource]);

  // Update filter gains when sliders move
  useEffect(() => {
    filtersRef.current.forEach((filter, i) => {
      filter.gain.value = gains[i];
    });
  }, [gains]);

  return (
    <div className="flex gap-3 p-4 bg-black/60 rounded-2xl shadow-2xl overflow-x-auto">
      {bands.map((band, i) => (
        <div key={band.freq} className="flex flex-col items-center">
          <input
            type="range"
            min={-15}
            max={15}
            value={gains[i]}
            step={0.1}
            onChange={e => {
              const newGains = [...gains];
              newGains[i] = Number(e.target.value);
              setGains(newGains);
            }}
            className={`h-32 w-3 rounded-lg appearance-none bg-gradient-to-b ${sliderColors[i % sliderColors.length]} accent-white`}
            style={{
              writingMode: "bt-lr",
              WebkitAppearance: "slider-vertical",
            }}
          />
          <span className="text-xs text-white mt-2 select-none">{band.label}</span>
        </div>
      ))}
    </div>
  );
};
export default Equalizer;