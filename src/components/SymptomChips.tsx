import { motion } from 'framer-motion';

interface SymptomChipsProps {
  selectedSymptoms: string[];
  onToggle: (symptom: string) => void;
}

const symptoms = [
  { id: 'bloating', label: 'Bloating' },
  { id: 'reflux', label: 'Reflux' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'stool-change', label: 'Stool change' },
  { id: 'none', label: 'None' },
];

export function SymptomChips({ selectedSymptoms, onToggle }: SymptomChipsProps) {
  const handleToggle = (symptomId: string) => {
    if (symptomId === 'none') {
      // If selecting "none", clear other symptoms
      onToggle('none');
    } else {
      // If selecting any other symptom, make sure "none" is deselected
      onToggle(symptomId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      <p className="text-sm font-medium text-muted-foreground">
        Any symptoms after eating?
      </p>
      
      <div className="flex flex-wrap gap-2">
        {symptoms.map((symptom) => {
          const isActive = selectedSymptoms.includes(symptom.id);
          return (
            <button
              key={symptom.id}
              onClick={() => handleToggle(symptom.id)}
              className={`chip ${isActive ? 'chip-active' : 'chip-default'}`}
            >
              {symptom.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
