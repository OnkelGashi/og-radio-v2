// src/components/GenreBackground.tsx
import React from "react";

// FULL DYNAMIC GENRE BACKGROUND — ALL GENRES!
const GenreBackground = ({ genre }: { genre: string | null }) => {
  // Fallback/Default background
  if (!genre) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#101018] via-[#181c32] to-[#181b26] opacity-95 transition-all duration-700"></div>
    );
  }

  switch (genre) {
    // --- LOFI: Pastel Blobs, Vinyl Lines ---
    case "lofi":
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden transition-all duration-700">
          {/* Deeper pastel gradient with dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-pink-400/60 via-blue-400/60 to-purple-700/70 blur-md" />
          <div className="absolute inset-0 bg-black/30" />
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-2xl opacity-30"
              style={{
                background: `linear-gradient(135deg, #f8b6ff 50%, #94d7ef 80%)`,
                width: `${60 + Math.random() * 60}px`,
                height: `${60 + Math.random() * 80}px`,
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 90}%`,
                filter: `blur(${Math.random() * 3 + 2}px)`,
                animation: `lofiFloat ${12 + Math.random() * 10}s ease-in-out infinite alternate`,
                animationDelay: `${i * 1.7}s`,
              }}
            />
          ))}
          {/* Subtle Vinyl Lines */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`vinyl-${i}`}
              className="absolute left-1/2 top-1/2 w-[900px] h-1 border-b border-white/10 rounded-full"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 8 + 5}deg)`,
                top: `${45 + i * 6}%`,
                opacity: 0.15,
              }}
            />
          ))}
          <style>{`@keyframes lofiFloat { 0% { transform: translateY(0px);} 100% { transform: translateY(-30px);} }`}</style>
        </div>
      );

    // --- HIP HOP: Urban Skyline, EQ Bars, Graffiti Glow ---
    case "hip-hop":
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden transition-all duration-700 bg-black">
          {/* Deeper city gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/90 to-[#181c32] opacity-95" />
          <div className="absolute inset-0 bg-black/40" />
          <svg
            className="absolute bottom-0 left-0 w-full h-44 opacity-70"
            viewBox="0 0 1440 300"
            preserveAspectRatio="none"
          >
            <g>
              <rect x="80" y="120" width="60" height="180" fill="#181c32" />
              <rect x="160" y="180" width="40" height="120" fill="#23243a" />
              <rect x="260" y="90" width="100" height="210" fill="#1a1c28" />
              <rect x="400" y="160" width="60" height="140" fill="#272541" />
              <rect x="520" y="110" width="80" height="190" fill="#111827" />
              <rect x="660" y="180" width="60" height="120" fill="#23243a" />
              <rect x="900" y="110" width="90" height="190" fill="#1a1c28" />
              <rect x="1100" y="170" width="80" height="130" fill="#23243a" />
              {/* Add more for a city look */}
            </g>
          </svg>
          {/* Graffiti Glow */}
          <div className="absolute bottom-44 left-1/2 -translate-x-1/2 w-[380px] h-32 bg-yellow-400/10 blur-2xl rounded-full z-0"></div>
          {/* EQ Bars */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="w-2 rounded-md bg-gradient-to-t from-yellow-400 to-amber-700"
                style={{
                  height: `${30 + Math.random() * 50}px`,
                  animation: `eqPulse 0.8s ease-in-out ${i * 0.09}s infinite alternate`,
                }}
              />
            ))}
          </div>
          <style>
            {`
            @keyframes eqPulse {
              0% { height: 30px; }
              100% { height: 80px; }
            }
            `}
          </style>
        </div>
      );

    // --- ELECTRONIC / EDM: Neon Rings, Laser Pulses ---
    case "edm":
    case "electronic":
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden transition-all duration-700">
          {/* More saturated neon gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00e4ff] via-[#0f0025] to-[#b180fc] opacity-95 blur-md" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex justify-center items-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border-4 border-cyan-400/40"
                style={{
                  width: `${200 + i * 160}px`,
                  height: `${200 + i * 160}px`,
                  animation: `edmPulse 2.4s cubic-bezier(.4,0,.2,1) ${i * 0.7}s infinite`,
                }}
              />
            ))}
            {/* Laser Flickers */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`laser-${i}`}
                className="absolute top-1/2 left-1/2 w-[2px] h-[350px] bg-cyan-400/10"
                style={{
                  transform: `rotate(${i * 60}deg) translateY(-120px)`,
                  animation: `laserFlicker 1.5s linear ${i * 0.5}s infinite alternate`,
                }}
              />
            ))}
          </div>
          <style>
            {`
            @keyframes edmPulse {
              0% { opacity: 0.25; transform: scale(1);}
              80% { opacity: 0.09;}
              100% { opacity: 0; transform: scale(1.22);}
            }
            @keyframes laserFlicker {
              0%, 100% { opacity: 0.05; }
              50% { opacity: 0.22; }
            }
            `}
          </style>
        </div>
      );

    // --- RAP: Neon Graffiti & City Pulse ---
    case "rap":
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden transition-all duration-700 bg-black">
          {/* Deeper purple/fuchsia gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-fuchsia-900/60 to-indigo-900/90 opacity-95" />
          <div className="absolute inset-0 bg-black/40" />
          <svg
            className="absolute bottom-0 left-0 w-full h-40 opacity-70"
            viewBox="0 0 1440 300"
            preserveAspectRatio="none"
          >
            <g>
              <rect x="70" y="150" width="80" height="150" fill="#23243a" />
              <rect x="180" y="120" width="60" height="180" fill="#23243a" />
              <rect x="270" y="170" width="90" height="130" fill="#8b5cf6" />
              <rect x="540" y="140" width="100" height="160" fill="#c026d3" />
              <rect x="980" y="140" width="90" height="160" fill="#a21caf" />
              <rect x="1150" y="160" width="80" height="140" fill="#1a1c28" />
            </g>
          </svg>
          {/* Animated Neon Pulse */}
          <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-[370px] h-24 bg-fuchsia-500/10 blur-2xl rounded-full z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-4 border-fuchsia-400/20 animate-pulse"></div>
        </div>
      );

    // --- R&B: Pink Aurora Waves ---
    case "rnb":
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden transition-all duration-700">
          {/* Deeper pink/purple gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-pink-700/60 via-pink-400/40 to-purple-900/80 blur-lg" />
          <div className="absolute inset-0 bg-black/30" />
          <svg
            className="absolute bottom-0 left-0 w-full h-32"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 Q320,120 720,60 T1440,60 L1440,120 L0,120Z"
              fill="#f9a8d4"
              opacity="0.09"
            />
            <path
              d="M0,90 Q360,10 720,90 T1440,60 L1440,120 L0,120Z"
              fill="#e879f9"
              opacity="0.10"
            />
          </svg>
          {/* Soft bokeh */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-3xl opacity-20"
              style={{
                background: "radial-gradient(circle at 30% 30%, #f9a8d4 60%, transparent 100%)",
                width: `${50 + Math.random() * 90}px`,
                height: `${50 + Math.random() * 90}px`,
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 88}%`,
              }}
            />
          ))}
        </div>
      );

    // --- INDIE: Stars + Dream Clouds ---
    case "indie":
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden transition-all duration-700">
          {/* Deeper blue/gray gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#c7d2fe] via-[#64748b]/70 to-[#161927]/95" />
          <div className="absolute inset-0 bg-black/30" />
          {/* Starfield */}
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                background: "rgba(255,255,255,0.26)",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4 + 0.23,
                filter: "blur(1px)",
              }}
            />
          ))}
          {/* Dream clouds */}
          <svg className="absolute bottom-8 left-1/4 opacity-22" width="320" height="50">
            <ellipse cx="90" cy="25" rx="90" ry="15" fill="#fff" />
            <ellipse cx="180" cy="28" rx="60" ry="10" fill="#fff" />
          </svg>
        </div>
      );

    // --- AMBIENT: Floating Orbs, Bokeh Waves ---
    case "ambient":
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden transition-all duration-700">
          {/* Deeper teal/blue gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/80 via-teal-800/60 to-[#161927] blur-md" />
          <div className="absolute inset-0 bg-black/30" />
          {/* Floating orbs */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${50 + Math.random() * 120}px`,
                height: `${50 + Math.random() * 120}px`,
                background: "radial-gradient(circle at 30% 30%, #a7f3d0 60%, transparent 100%)",
                top: `${Math.random() * 85}%`,
                left: `${Math.random() * 90}%`,
                opacity: Math.random() * 0.18 + 0.10,
                filter: "blur(9px)",
                animation: `ambientFloat ${8 + Math.random() * 10}s ease-in-out infinite alternate`,
                animationDelay: `${i * 2.1}s`,
              }}
            />
          ))}
          <style>
            {`
            @keyframes ambientFloat {
              0% { transform: translateY(0px);}
              100% { transform: translateY(-28px);}
            }
            `}
          </style>
        </div>
      );

    // --- JAZZ: Amber Gradients, Light Leaks, Bokeh Circles ---
    case "jazz":
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden transition-all duration-700">
          {/* Deeper amber/orange gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-700/60 via-orange-400/40 to-orange-900/80 blur-md" />
          <div className="absolute inset-0 bg-black/30" />
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-2xl opacity-25"
              style={{
                background: "radial-gradient(circle at 40% 30%, #fbbf24 60%, transparent 100%)",
                width: `${30 + Math.random() * 60}px`,
                height: `${30 + Math.random() * 60}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      );

    // --- ROCK: Gritty/Red Gradients, Faint Lightning ---
    case "rock":
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden transition-all duration-700 bg-[#200C10]">
          {/* Deeper red/black gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/60 via-red-900/40 to-black opacity-95 blur-md" />
          <div className="absolute inset-0 bg-black/40" />
          {/* Lightning flashes */}
          {[...Array(4)].map((_, i) => (
            <svg
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 95}%`,
                opacity: 0.19,
                width: 42,
                height: 50,
              }}
              viewBox="0 0 40 50"
            >
              <polyline
                points="0,10 15,30 8,30 22,48"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeDasharray="6,4"
              />
            </svg>
          ))}
        </div>
      );

    // --- EXPERIMENTAL: Glitch Blobs, Vivid Purples ---
    case "experimental":
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden transition-all duration-700">
          {/* Deeper fuchsia/purple gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/60 via-violet-900/70 to-purple-900/80 blur-md" />
          <div className="absolute inset-0 bg-black/30" />
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-2xl opacity-18"
              style={{
                background: `linear-gradient(120deg, #a21caf 50%, #7c3aed 80%)`,
                width: `${48 + Math.random() * 48}px`,
                height: `${38 + Math.random() * 58}px`,
                top: `${Math.random() * 97}%`,
                left: `${Math.random() * 97}%`,
                filter: `blur(${Math.random() * 2 + 3}px)`,
                animation: `glitchFloat ${6 + Math.random() * 6}s ease-in-out infinite alternate`,
                animationDelay: `${i * 1.3}s`,
              }}
            />
          ))}
          {/* Glitchy lines */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`glitch-line-${i}`}
              className="absolute w-full h-0.5 bg-gradient-to-r from-fuchsia-400 to-violet-600"
              style={{
                top: `${Math.random() * 100}%`,
                opacity: 0.12,
                animation: `glitchLine 3s linear ${i * 0.8}s infinite alternate`,
              }}
            />
          ))}
          <style>
            {`
            @keyframes glitchFloat {
              0% { transform: translateY(0px);}
              100% { transform: translateY(-16px);}
            }
            @keyframes glitchLine {
              0% { opacity: 0.15; }
              50% { opacity: 0.45; }
              100% { opacity: 0.15; }
            }
            `}
          </style>
        </div>
      );

    // --- DEFAULT: OG Cosmic Gradient ---
    default:
      return (
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#101018] via-[#181c32] to-[#181b26] opacity-95 transition-all duration-700"></div>
      );
  }
};

export default GenreBackground;
