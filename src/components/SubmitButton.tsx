import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  onSubmit: () => void;
}

export function SubmitButton({ onSubmit }: SubmitButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <Button
        onClick={onSubmit}
        className="w-full py-6 text-base font-semibold"
        size="lg"
      >
        <Check className="w-5 h-5 mr-2" />
        Submit Today's Meal Log
      </Button>
    </motion.div>
  );
}
