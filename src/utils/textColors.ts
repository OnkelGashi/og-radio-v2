import { getAverageGradientHex } from "@/utils/colorUtils";
import { getContrastYIQ } from "@/utils/getContrastYIQ";

// Pure helper: just give it the gradient string!
export const getDynamicTextClass = (gradient: string): string => {
  const avgHex = getAverageGradientHex(gradient);
  return getContrastYIQ(avgHex);
};