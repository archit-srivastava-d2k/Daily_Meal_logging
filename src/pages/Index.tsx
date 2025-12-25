import { useState, useCallback, useEffect } from "react";
import { MealData } from "@/components/MealCard";
import { Header } from "@/components/Header";
import { AlertNotification } from "@/components/AlertNotification";
import { WelcomeSection } from "@/components/WelcomeSection";
import { ProgressBar } from "@/components/ProgressBar";
import { MealsList } from "@/components/MealsList";
import { SubmitButton } from "@/components/SubmitButton";
import { SuccessSummary } from "@/components/SuccessSummary";
import {
  getTodayDate,
  getYesterdayDate,
  getMealLogsFromStorage,
  saveMealLogsToStorage,
  initializeDefaultYesterdayMeals,
} from "@/utils/mealStorage";

const meals = [
  { id: "breakfast", name: "Breakfast", icon: "🌅" },
  { id: "lunch", name: "Lunch", icon: "☀️" },
  { id: "dinner", name: "Dinner", icon: "🌙" },
  { id: "snacks", name: "Snacks", icon: "🍎" },
];

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
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    setIsSubmitted(true);
    setAlert({
      type: "success",
      title: "Success! 🎉",
      message: "Your meals for today have been logged successfully.",
    });
    setTimeout(() => setAlert(null), 3000);
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
      <Header completed={stats.completed} total={stats.total} />
      <AlertNotification alert={alert} onDismiss={() => setAlert(null)} />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <WelcomeSection />
        <ProgressBar completed={stats.completed} total={stats.total} />
        <MealsList
          meals={meals}
          activeCard={activeCard}
          mealsData={mealsData}
          yesterdayMeals={yesterdayMeals}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
        />

        {stats.completed === stats.total && !isSubmitted && (
          <SubmitButton onSubmit={handleSubmit} />
        )}

        {isSubmitted && <SuccessSummary />}
      </main>
    </div>
  );
}
