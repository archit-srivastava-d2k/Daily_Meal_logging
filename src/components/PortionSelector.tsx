import { Circle, Coffee, UtensilsCrossed, Cookie } from "lucide-react";
import { motion } from "framer-motion";

interface PortionSelectorProps {
  item: string;
  selectedPortion: string | null;
  onSelect: (portion: string | null) => void;
}

// Helper to detect food type and return appropriate icons
const getFoodTypeIcons = (item: string) => {
  const lowerItem = item.toLowerCase();

  // Beverages
  if (
    lowerItem.includes("tea") ||
    lowerItem.includes("coffee") ||
    lowerItem.includes("juice") ||
    lowerItem.includes("water") ||
    lowerItem.includes("milk") ||
    lowerItem.includes("smoothie")
  ) {
    return {
      icon: Coffee,
      portions: [
        { id: "small", label: "Small", emoji: "☕", size: 14 },
        { id: "medium", label: "Medium", emoji: "☕", size: 18 },
        { id: "large", label: "Large", emoji: "☕", size: 22 },
      ],
    };
  }

  // Snacks/Dry items
  if (
    lowerItem.includes("nuts") ||
    lowerItem.includes("chips") ||
    lowerItem.includes("cookie") ||
    lowerItem.includes("biscuit") ||
    lowerItem.includes("namkeen")
  ) {
    return {
      icon: Cookie,
      portions: [
        { id: "small", label: "Handful", emoji: "🤏", size: 14 },
        { id: "medium", label: "Bowl", emoji: "🥣", size: 18 },
        { id: "large", label: "Large", emoji: "🥣", size: 22 },
      ],
    };
  }

  // Main meals (curry, dal, sabji, rice, roti, etc.)
  return {
    icon: UtensilsCrossed,
    portions: [
      { id: "small", label: "Small", emoji: "🍽️", size: 14 },
      { id: "medium", label: "Medium", emoji: "🍽️", size: 18 },
      { id: "large", label: "Large", emoji: "🍽️", size: 22 },
    ],
  };
};

const portions = [
  { id: "small", label: "Small", size: 16 },
  { id: "medium", label: "Medium", size: 24 },
  { id: "large", label: "Large", size: 32 },
];

export function PortionSelector({
  item,
  selectedPortion,
  onSelect,
}: PortionSelectorProps) {
  const { portions: foodPortions } = getFoodTypeIcons(item);

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
        {foodPortions.map((portion) => (
          <button
            key={portion.id}
            onClick={() =>
              onSelect(selectedPortion === portion.id ? null : portion.id)
            }
            className={`portion-btn ${
              selectedPortion === portion.id ? "portion-btn-active" : ""
            }`}
            title={portion.label}
          >
            <span className="text-xl">{portion.emoji}</span>
            <span className="text-xs">{portion.label}</span>
          </button>
        ))}

        <button
          onClick={() => onSelect("no-idea")}
          className={`portion-btn ${
            selectedPortion === "no-idea" ? "portion-btn-active" : ""
          }`}
        >
          <span className="text-lg">?</span>
          <span className="text-xs">No idea</span>
        </button>
      </div>
    </motion.div>
  );
}
