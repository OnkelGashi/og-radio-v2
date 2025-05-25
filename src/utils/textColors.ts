// /utils/textColors.ts

// These genre backgrounds are LIGHT, so need dark text.
const LIGHT_BG_GENRES = ["lofi", "indie", "ambient", "jazz"];

export const getHeadingTextColorClass = (genre: string | null): string =>
  genre && LIGHT_BG_GENRES.includes(genre) ? "text-[#161616]" : "text-white";

export const getBodyTextColorClass = (genre: string | null): string =>
  genre && LIGHT_BG_GENRES.includes(genre) ? "text-[#313132]" : "text-gray-200";

export const getHighlightTextColorClass = (genre: string | null): string =>
  genre && LIGHT_BG_GENRES.includes(genre)
    ? "text-[#3b82f6]" // Blue for highlight on light
    : "text-cyan-300";

export const getGenreTitleTextColorClass = (genre: string | null): string => {
  switch (genre) {
    case "hip-hop": return "text-[#FF4500]";      // OrangeRed
    case "electronic": return "text-[#E0FFFF]";   // LightCyan
    case "rap": return "text-[#FFC0CB]";          // Pink
    case "rnb": return "text-[#F0FFFF]";          // Azure
    case "indie": return "text-[#161616]";
    case "ambient": return "text-[#313132]";
    case "jazz": return "text-[#161616]";
    case "rock": return "text-[#FFD700]";         // Gold
    case "lofi": return "text-[#161616]";
    case "experimental": return "text-[#32CD32]"; // LimeGreen
    default: return "text-white";
  }
};
