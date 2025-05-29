import { useUIStore } from "@/stores/uiStore";

const NightModeToggle = () => {
  const nightMode = useUIStore((s) => s.nightMode);
  const toggleNightMode = useUIStore((s) => s.toggleNightMode);

  return (
    <button
      onClick={toggleNightMode}
      className="px-2 py-1 bg-gray-800 text-white rounded shadow text-xs"
      aria-label="Toggle Night Mode"
    >
      {nightMode ? "🌙" : "☀️"}
    </button>
  );
};

export default NightModeToggle;