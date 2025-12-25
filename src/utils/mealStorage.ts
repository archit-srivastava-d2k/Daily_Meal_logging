import { MealData } from "@/components/MealCard";

const STORAGE_KEY = "mealLogs";

export const getTodayDate = () => new Date().toISOString().split("T")[0];

export const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};

export const getMealLogsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return {};
  }
};

export const saveMealLogsToStorage = (
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
};

export const initializeDefaultYesterdayMeals = () => {
  const allLogs = getMealLogsFromStorage();
  const yesterdayDate = getYesterdayDate();

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
