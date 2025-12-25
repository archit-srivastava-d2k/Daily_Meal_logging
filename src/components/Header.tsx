import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

interface HeaderProps {
  completed: number;
  total: number;
}

export function Header({ completed, total }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <span className="font-serif font-semibold text-foreground">
            MealLog
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary">{completed}</span>
          <span>/</span>
          <span>{total} logged</span>
        </div>
      </div>
    </motion.header>
  );
}
