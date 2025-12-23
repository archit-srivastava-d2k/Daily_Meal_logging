import { Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PortionSelectorProps {
  item: string;
  selectedPortion: string | null;
  onSelect: (portion: string | null) => void;
}

const portions = [
  { id: 'small', label: 'Small', size: 16 },
  { id: 'medium', label: 'Medium', size: 24 },
  { id: 'large', label: 'Large', size: 32 },
];

export function PortionSelector({ item, selectedPortion, onSelect }: PortionSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-4 py-3 px-4 bg-muted/30 rounded-xl"
    >
      <span className="text-sm font-medium text-foreground flex-1 capitalize">
        {item.trim()}
      </span>
      
      <div className="flex items-center gap-2">
        {portions.map((portion) => (
          <button
            key={portion.id}
            onClick={() => onSelect(selectedPortion === portion.id ? null : portion.id)}
            className={`portion-btn ${selectedPortion === portion.id ? 'portion-btn-active' : ''}`}
          >
            <Circle size={portion.size} strokeWidth={2} className="transition-all" />
            <span className="text-xs">{portion.label}</span>
          </button>
        ))}
        
        <button
          onClick={() => onSelect('skip')}
          className={`portion-btn ${selectedPortion === 'skip' ? 'portion-btn-active' : ''}`}
        >
          <span className="text-lg">?</span>
          <span className="text-xs">Skip</span>
        </button>
      </div>
    </motion.div>
  );
}
