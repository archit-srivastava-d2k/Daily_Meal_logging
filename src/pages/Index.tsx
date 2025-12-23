import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MealCard, MealData } from '@/components/MealCard';
import { Leaf } from 'lucide-react';

const meals = [
  { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
  { id: 'lunch', name: 'Lunch', icon: '☀️' },
  { id: 'dinner', name: 'Dinner', icon: '🌙' },
  { id: 'snacks', name: 'Snacks', icon: '🍎' },
];

// Mock yesterday's meals for the repeat feature
const yesterdayMeals: Record<string, string> = {
  breakfast: 'Oatmeal with banana, coffee',
  lunch: '2 ragi rotis, moong dal, cucumber salad',
  dinner: 'Brown rice, sambar, yogurt',
  snacks: 'Mixed nuts, green tea',
};

const initialMealData: MealData = {
  items: [],
  portions: {},
  skipped: false,
  feeling: null,
  symptoms: [],
  note: '',
};

export default function Index() {
  const [activeCard, setActiveCard] = useState<string | null>('breakfast');
  const [mealsData, setMealsData] = useState<Record<string, MealData>>({
    breakfast: { ...initialMealData },
    lunch: { ...initialMealData },
    dinner: { ...initialMealData },
    snacks: { ...initialMealData },
  });

  const handleToggle = useCallback((mealId: string) => {
    setActiveCard((current) => (current === mealId ? null : mealId));
  }, []);

  const handleUpdate = useCallback((mealId: string, data: Partial<MealData>) => {
    setMealsData((current) => ({
      ...current,
      [mealId]: { ...current[mealId], ...data },
    }));
  }, []);

  const getCompletionStats = () => {
    const completed = Object.values(mealsData).filter(
      (meal) => meal.skipped || (meal.items.length > 0 && meal.feeling)
    ).length;
    return { completed, total: 4 };
  };

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <span className="font-serif font-semibold text-foreground">MealLog</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-primary">{stats.completed}</span>
            <span>/</span>
            <span>{stats.total} logged</span>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
            Let's log your meals for today
          </h1>
          <p className="text-muted-foreground">
            Track your breakfast, lunch, dinner, and snacks — and how they made you feel.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.completed / stats.total) * 100}%` }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Meal Cards */}
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
                onToggle={() => handleToggle(meal.id)}
                data={mealsData[meal.id]}
                onUpdate={(data) => handleUpdate(meal.id, data)}
                yesterdayMeal={yesterdayMeals[meal.id]}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Summary Footer */}
        {stats.completed === stats.total && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 card-wellness text-center"
          >
            <span className="text-4xl mb-3 block">🎉</span>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
              All meals logged!
            </h2>
            <p className="text-muted-foreground text-sm">
              Great job tracking your nutrition today. See you tomorrow!
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
