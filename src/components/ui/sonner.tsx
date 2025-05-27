// src/components/ui/sonner.tsx
import { useTheme } from "next-themes";
// Import 'Toaster' and 'toast' from the actual 'sonner' library, using aliases to avoid name conflicts
import { Toaster as SonnerPrimitive, toast as toastFunctionFromSonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerPrimitive>;

// Your custom Toaster component that wraps SonnerPrimitive
const ToasterWrapper = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <SonnerPrimitive // Use the aliased import SonnerPrimitive here
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

// Export your custom Toaster component as 'Toaster'
// and the original toast function from sonner as 'toast'
export { ToasterWrapper as Toaster, toastFunctionFromSonner as toast };