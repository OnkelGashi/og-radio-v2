import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScheduleCTAButton = ({ children }: { children: React.ReactNode }) => (
  <Button
    variant="outline"
    size="lg"
    className="border-gray-600 text-black hover:bg-gray-800 transition-all duration-300"
  >
    <Calendar className="w-5 h-5 mr-2" />
    {children}
  </Button>
);

export default ScheduleCTAButton;