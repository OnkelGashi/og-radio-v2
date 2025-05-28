import { tailwindColorHexMap } from "./tailwindColorHexMap";
import { getAverageGradientHex } from "./colorUtils"; // Adjust path if needed

// Helper: Given "green-600", returns "#16A34A"
function getTailwindHex(colorClass: string): string | null {
  return tailwindColorHexMap[colorClass] || null;
}

// Parse gradient string, e.g., "from-green-600 to-emerald-600"
function getGradientStops(gradient: string): string[] {
  return gradient
    .split(' ')
    .map(s => s.replace(/(from\-|to\-|via\-)/, ''))
    .filter(Boolean);
}

// Convert HEX to RGB
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substr(0,2),16);
  const g = parseInt(hex.substr(2,2),16);
  const b = parseInt(hex.substr(4,2),16);
  return [r, g, b];
}

// Get average RGB from a gradient string (e.g., "from-green-600 to-emerald-600")
export function getAverageGradientHex(gradient: string): string {
  const stops = getGradientStops(gradient);
  const rgbs = stops
    .map(getTailwindHex)
    .filter(Boolean)
    .map(hexToRgb);

  if (rgbs.length === 0) return "#181c32";
  const avg = rgbs.reduce(
    (acc, rgb) => [acc[0]+rgb[0], acc[1]+rgb[1], acc[2]+rgb[2]],
    [0,0,0]
  ).map(x => Math.round(x / rgbs.length));

  // Return as HEX string
  return "#" + avg.map(x => x.toString(16).padStart(2, '0')).join('');
}