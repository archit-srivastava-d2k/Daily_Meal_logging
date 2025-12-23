import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Minus, RotateCcw, Sparkles } from "lucide-react";
import { PortionSelector } from "./PortionSelector";
import { FeelingSelector } from "./FeelingSelector";
import { SymptomChips } from "./SymptomChips";

export interface MealData {
  items: string[];
  portions: Record<string, string | null>;
  skipped: boolean;
  feeling: string | null;
  symptoms: string[];
  note: string;
}

interface MealCardProps {
  mealName: string;
  icon: string;
  isActive: boolean;
  onToggle: () => void;
  data: MealData;
  onUpdate: (data: Partial<MealData>) => void;
  yesterdayMeal?: string;
}

// Smart meal suggestions based on meal type
const mealSuggestions: Record<string, string[]> = {
  Breakfast: [
    "Oatmeal with banana",
    "Idli with sambar",
    "Poha",
    "Upma",
    "Paratha with curd",
    "Dosa with chutney",
    "Eggs and toast",
  ],
  Lunch: [
    "2 ragi rotis with dal",
    "Rice with sambar",
    "Chole with rice",
    "Rajma chawal",
    "Mix veg curry",
    "Palak paneer",
  ],
  Dinner: [
    "Khichdi",
    "Light dal with roti",
    "Vegetable soup",
    "Quinoa salad",
    "Roti with sabji",
  ],
  Snacks: [
    "Mixed nuts",
    "Fruits",
    "Green tea",
    "Roasted chana",
    "Sprouts",
    "Buttermilk",
  ],
};

export function MealCard({
  mealName,
  icon,
  isActive,
  onToggle,
  data,
  onUpdate,
  yesterdayMeal,
}: MealCardProps) {
  const [inputValue, setInputValue] = useState(data.items.join(", "));
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isActive && textareaRef.current && !data.skipped) {
      textareaRef.current.focus();
    }
  }, [isActive, data.skipped]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    onUpdate({ items });
  };

  const handlePortionSelect = (item: string, portion: string | null) => {
    onUpdate({
      portions: { ...data.portions, [item]: portion },
    });
  };

  const handleRepeatYesterday = () => {
    if (yesterdayMeal) {
      setInputValue(yesterdayMeal);
      const items = yesterdayMeal
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      onUpdate({ items, skipped: false });
    }
  };

  const handleSymptomToggle = (symptomId: string) => {
    if (symptomId === "none") {
      onUpdate({ symptoms: data.symptoms.includes("none") ? [] : ["none"] });
    } else {
      const newSymptoms = data.symptoms.filter((s) => s !== "none");
      if (newSymptoms.includes(symptomId)) {
        onUpdate({ symptoms: newSymptoms.filter((s) => s !== symptomId) });
      } else {
        onUpdate({ symptoms: [...newSymptoms, symptomId] });
      }
    }
  };

  const getStatus = () => {
    if (data.skipped)
      return { label: "Skipped", color: "text-muted-foreground" };
    if (data.items.length > 0 && data.feeling)
      return { label: "Logged", color: "text-success" };
    if (data.items.length > 0)
      return { label: "In progress", color: "text-warning" };
    return { label: "Pending", color: "text-muted-foreground" };
  };

  const status = getStatus();

  return (
    <motion.div layout className="card-wellness overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">{icon}</span>
          <div className="text-left">
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {mealName}
            </h3>
            <span className={`text-sm ${status.color}`}>
              {status.label === "Logged" && (
                <Check className="inline w-3 h-3 mr-1" />
              )}
              {status.label === "Skipped" && (
                <Minus className="inline w-3 h-3 mr-1" />
              )}
              {status.label}
            </span>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-5 border-t border-border/50 pt-5">
              {/* Skip Toggle */}
              <button
                onClick={() => onUpdate({ skipped: !data.skipped })}
                className={`w-full py-3 px-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                  data.skipped
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                I didn't have {mealName.toLowerCase()} today
              </button>

              {!data.skipped && (
                <>
                  {/* Question */}
                  <p className="text-base text-foreground font-medium">
                    What did you have for {mealName.toLowerCase()}?
                  </p>

                  {/* Smart Suggestions */}
                  {data.items.length === 0 && mealSuggestions[mealName] && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2"
                    >
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Quick add:
                      </span>
                      {mealSuggestions[mealName]
                        .slice(0, 4)
                        .map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => {
                              const newValue = inputValue
                                ? `${inputValue}, ${suggestion}`
                                : suggestion;
                              setInputValue(newValue);
                              const items = newValue
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean);
                              onUpdate({ items });
                            }}
                            className="text-xs px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                          >
                            + {suggestion}
                          </button>
                        ))}
                    </motion.div>
                  )}

                  {/* Repeat Yesterday Button */}
                  {yesterdayMeal && (
                    <button
                      onClick={handleRepeatYesterday}
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Repeat yesterday's {mealName.toLowerCase()}
                    </button>
                  )}

                  {/* Freeform Text Area */}
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={`e.g., 2 ragi rotis, moong dal, salad`}
                    className="meal-textarea"
                  />

                  {/* Portion Selectors */}
                  {data.items.length > 0 && (
                    <div className="space-y-2">
                      {data.items.map((item, index) => (
                        <PortionSelector
                          key={`${item}-${index}`}
                          item={item}
                          selectedPortion={data.portions[item] || null}
                          onSelect={(portion) =>
                            handlePortionSelect(item, portion)
                          }
                        />
                      ))}
                    </div>
                  )}

                  {/* Body Feel Section - Shows after items are added */}
                  {data.items.length > 0 && (
                    <div className="space-y-5 pt-4 border-t border-border/50">
                      <FeelingSelector
                        selectedFeeling={data.feeling}
                        onSelect={(feeling) => onUpdate({ feeling })}
                      />

                      <SymptomChips
                        selectedSymptoms={data.symptoms}
                        onToggle={handleSymptomToggle}
                      />

                      {/* Optional Note */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                      >
                        <p className="text-sm font-medium text-muted-foreground">
                          Anything unusual about today's meal or timing?
                        </p>
                        <textarea
                          value={data.note}
                          onChange={(e) => onUpdate({ note: e.target.value })}
                          placeholder="Optional notes..."
                          className="meal-textarea min-h-[60px]"
                        />
                      </motion.div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
