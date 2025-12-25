import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { MealCard, MealData } from "@/components/MealCard";
import { Leaf, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const meals = [
  { id: "breakfast", name: "Breakfast", icon: "🌅" },
  { id: "lunch", name: "Lunch", icon: "☀️" },
  { id: "dinner", name: "Dinner", icon: "🌙" },
  { id: "snacks", name: "Snacks", icon: "🍎" },
];

// Helper functions for local storage
const STORAGE_KEY = "mealLogs";

const getTodayDate = () => new Date().toISOString().split("T")[0]; // give today's date

const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}; // give yesterday's date

const getMealLogsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return {};
  }
};

const saveMealLogsToStorage = (
  date: string,
  meals: Record<string, MealData>
) => {
  try {
    const allLogs = getMealLogsFromStorage();
    allLogs[date] = meals;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}; // it updates today's meal data only , if its new ,then simply add it

// Initialize default meals for yesterday (first-time users)
const initializeDefaultYesterdayMeals = () => {
  const allLogs = getMealLogsFromStorage();
  const yesterdayDate = getYesterdayDate();

  // Only add default meals if yesterday's data doesn't exist
  if (!allLogs[yesterdayDate]) {
    const defaultYesterdayMeals: Record<string, MealData> = {
      breakfast: {
        items: ["Oatmeal with banana", "Coffee"],
        portions: { "Oatmeal with banana": "medium", Coffee: "small" },
        skipped: false,
        feeling: "good",
        symptoms: ["none"],
        note: "",
      },
      lunch: {
        items: ["2 ragi rotis", "Moong dal", "Cucumber salad"],
        portions: {
          "2 ragi rotis": "medium",
          "Moong dal": "medium",
          "Cucumber salad": "small",
        },
        skipped: false,
        feeling: "great",
        symptoms: ["none"],
        note: "",
      },
      dinner: {
        items: ["Brown rice", "Sambar", "Yogurt"],
        portions: { "Brown rice": "medium", Sambar: "medium", Yogurt: "small" },
        skipped: false,
        feeling: "good",
        symptoms: ["none"],
        note: "",
      },
      snacks: {
        items: ["Mixed nuts", "Green tea"],
        portions: { "Mixed nuts": "small", "Green tea": "small" },
        skipped: false,
        feeling: "great",
        symptoms: ["none"],
        note: "",
      },
    };

    saveMealLogsToStorage(yesterdayDate, defaultYesterdayMeals);
  }
};

const initialMealData: MealData = {
  items: [],
  portions: {},
  skipped: false,
  feeling: null,
  symptoms: [],
  note: "",
};

export default function Index() {
  const [activeCard, setActiveCard] = useState<string | null>("breakfast");
  const [mealsData, setMealsData] = useState<Record<string, MealData>>({
    breakfast: { ...initialMealData },
    lunch: { ...initialMealData },
    dinner: { ...initialMealData },
    snacks: { ...initialMealData },
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Initialize default yesterday's meals for first-time users
  useEffect(() => {
    initializeDefaultYesterdayMeals();
  }, []);

  // Load today's meals from localStorage on mount
  useEffect(() => {
    const allLogs = getMealLogsFromStorage();
    const todayDate = getTodayDate();
    const todayLogs = allLogs[todayDate] as
      | Record<string, MealData>
      | undefined;

    if (todayLogs) {
      setMealsData(todayLogs);
      // Check if already submitted
      const allCompleted = Object.values(todayLogs).every(
        (meal: MealData) =>
          meal.skipped || (meal.items.length > 0 && meal.feeling)
      );
      setIsSubmitted(allCompleted);
    }
  }, []);

  // Auto-save to localStorage whenever mealsData changes
  useEffect(() => {
    const todayDate = getTodayDate();
    saveMealLogsToStorage(todayDate, mealsData);
  }, [mealsData]);

  // Get yesterday's meals from localStorage
  const getYesterdayMeals = (): Record<string, string> => {
    const allLogs = getMealLogsFromStorage();
    const yesterdayDate = getYesterdayDate();
    const yesterdayLogs = allLogs[yesterdayDate] as
      | Record<string, MealData>
      | undefined;

    if (!yesterdayLogs) return {};

    const result: Record<string, string> = {};
    Object.entries(yesterdayLogs).forEach(([mealId, mealData]) => {
      const typedMealData = mealData as MealData;
      if (!typedMealData.skipped && typedMealData.items.length > 0) {
        result[mealId] = typedMealData.items.join(", ");
      }
    });

    return result;
  };

  const yesterdayMeals = getYesterdayMeals();

  const handleToggle = useCallback((mealId: string) => {
    setActiveCard((current) => (current === mealId ? null : mealId));
  }, []);

  const handleUpdate = useCallback(
    (mealId: string, data: Partial<MealData>) => {
      setMealsData((current) => ({
        ...current,
        [mealId]: { ...current[mealId], ...data },
      }));
      setIsSubmitted(false); // Reset submission status when editing
    },
    []
  );

  const handleSubmit = () => {
    const { completed, total } = getCompletionStats();

    if (completed < total) {
      setAlert({
        type: "error",
        title: "Incomplete meal log",
        message: `Please complete all ${total} meals before submitting (${completed}/${total} done).`,
      });
      return;
    }

    setIsSubmitted(true);
    setAlert({
      type: "success",
      title: "Success! 🎉",
      message: "Your meals for today have been logged successfully.",
    });
  };

  const getCompletionStats = () => {
    const completed = Object.values(mealsData).filter(
      (meal: MealData) =>
        meal.skipped || (meal.items.length > 0 && meal.feeling)
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
            <span className="font-serif font-semibold text-foreground">
              MealLog
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-primary">{stats.completed}</span>
            <span>/</span>
            <span>{stats.total} logged</span>
          </div>
        </div>
      </motion.header>

      {/* Alert Notification */}
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto px-4 pt-4"
        >
          <Alert variant={alert.type === "error" ? "destructive" : "default"}>
            <AlertTitle className="flex items-center justify-between">
              {alert.title}
              <button
                onClick={() => setAlert(null)}
                className="ml-auto hover:opacity-70"
              >
                <X className="h-4 w-4" />
              </button>
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </motion.div>
      )}

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
            Track your breakfast, lunch, dinner, and snacks — and how they made
            you feel.
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

        {/* Submit Button */}
        {stats.completed === stats.total && !isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Button
              onClick={handleSubmit}
              className="w-full py-6 text-base font-semibold"
              size="lg"
            >
              <Check className="w-5 h-5 mr-2" />
              Submit Today's Meal Log
            </Button>
          </motion.div>
        )}

        {/* Summary Footer */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 card-wellness text-center"
          >
            <span className="text-4xl mb-3 block">🎉</span>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
              All meals submitted!
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
