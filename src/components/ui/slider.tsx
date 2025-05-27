// src/components/ui/slider.tsx
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, onValueChange, disabled, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center group",
      disabled && "opacity-50 cursor-not-allowed", // Added disabled styling for root
      className
    )}
    value={value}
    onValueChange={onValueChange}
    disabled={disabled}
    inverted={false} // Explicitly set to false for LTR increase
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative h-2 w-full grow overflow-hidden rounded-full",
        // For Light mode: a noticeable grey background
        // For Dark mode: your existing dark secondary color
        "bg-slate-200 dark:bg-secondary"
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute h-full",
          // For Light mode: white fill
          // For Dark mode: your existing light primary color for fill
          "bg-white dark:bg-primary",
          disabled && "bg-slate-300 dark:bg-slate-700" // Disabled range color
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-5 w-5 rounded-full border-2 transition-colors",
        "border-primary dark:border-primary", // Keeps current border logic
        "bg-background dark:bg-background",   // Keeps current thumb background logic
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none", // Disabled thumb doesn't need new color if root is opacity-50
        disabled && "border-slate-300 dark:border-slate-700" // Disabled thumb border
      )}
      // No aria-orientation needed for horizontal slider by default
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }