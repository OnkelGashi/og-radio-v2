import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScheduleCTAButton = ({ children }: { children: React.ReactNode }) => (
  <Button
    variant="outline"
    size="lg"
    className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300"
  >
    <Calendar className="w-5 h-5 mr-2" />
    {children}
  </Button>
);

export default ScheduleCTAButton;