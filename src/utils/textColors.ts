// /utils/textColors.ts

// These genre backgrounds are LIGHT, so need dark text.
const LIGHT_BG_GENRES = ["lofi", "indie", "ambient", "jazz"];

export const getHeadingTextColorClass = (genre: string | null): string =>
  genre && LIGHT_BG_GENRES.includes(genre)
    ? "text-[#161616]"
    : genre === "rnb"
    ? "text-white"
    : "text-white";

export const getBodyTextColorClass = (genre: string | null): string =>
  genre === "ambient"
    ? "text-white"
    : genre && LIGHT_BG_GENRES.includes(genre)
    ? "text-[#313132]"
    : "text-gray-200";

export const getHighlightTextColorClass = (genre: string | null): string =>
  genre && LIGHT_BG_GENRES.includes(genre)
    ? "text-[#3b82f6]"
    : genre === "rnb"
    ? "text-rose-100"
    : "text-cyan-300";

export const getGenreTitleTextColorClass = (genre: string | null): string => {
  switch (genre) {
    case "hip-hop": return "text-[#FF4500]";
    case "electronic": return "text-[#E0FFFF]";
    case "rap": return "text-[#FFC0CB]";
    case "rnb": return "text-white"; // changed from #F0FFFF to white
    case "indie": return "text-[#161616]";
    case "ambient": return "text-[#313132]";
    case "jazz": return "text-[#161616]";
    case "rock": return "text-[#FFD700]";
    case "lofi": return "text-[#161616]";
    case "experimental": return "text-[#32CD32]";
    default: return "text-white";
  }
};
