import { motion } from "framer-motion";
import { MealCard, MealData } from "@/components/MealCard";

interface Meal {
  id: string;
  name: string;
  icon: string;
}

interface MealsListProps {
  meals: Meal[];
  activeCard: string | null;
  mealsData: Record<string, MealData>;
  yesterdayMeals: Record<string, string>;
  onToggle: (mealId: string) => void;
  onUpdate: (mealId: string, data: Partial<MealData>) => void;
}

export function MealsList({
  meals,
  activeCard,
  mealsData,
  yesterdayMeals,
  onToggle,
  onUpdate,
}: MealsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      {meals.map((meal, index) => (
        <motion.div
          key={meal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <MealCard
            mealName={meal.name}
            icon={meal.icon}
            isActive={activeCard === meal.id}
            onToggle={() => onToggle(meal.id)}
            data={mealsData[meal.id]}
            onUpdate={(data) => onUpdate(meal.id, data)}
            yesterdayMeal={yesterdayMeals[meal.id]}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
