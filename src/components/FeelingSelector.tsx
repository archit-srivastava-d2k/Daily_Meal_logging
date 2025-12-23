import { motion } from 'framer-motion';

interface FeelingSelectorProps {
  selectedFeeling: string | null;
  onSelect: (feeling: string) => void;
}

const feelings = [
  { id: 'light', emoji: '😌', label: 'Light' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'heavy', emoji: '😣', label: 'Heavy' },
];

export function FeelingSelector({ selectedFeeling, onSelect }: FeelingSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-3"
    >
      <p className="text-sm font-medium text-muted-foreground">
        How did it feel in your body?
      </p>
      
      <div className="flex gap-3">
        {feelings.map((feeling) => (
          <button
            key={feeling.id}
            onClick={() => onSelect(feeling.id)}
            className={`feeling-btn flex-1 ${selectedFeeling === feeling.id ? 'feeling-btn-active' : ''}`}
          >
            <span className="text-3xl">{feeling.emoji}</span>
            <span className="text-sm font-medium">{feeling.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
