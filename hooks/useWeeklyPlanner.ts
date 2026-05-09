import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { ScheduleState, CardItem } from "@/lib/utils/Types";
import { getCurrentWeek, filterCards, getUnscheduledCards, moveCard, removeCard } from "@/lib/utils/plannerUtils";

type PlannerRecipe = {
  _id: string;
  name: string;
  category: string;
  prepTime?: number;
  cookTime?: number;
  imageUrl?: string;
  image?: string;
  servings?: number;
  nutritionPerServing?: {
    calories?: number;
    protein?: number;
  };
  totalNutrition?: {
    calories?: number;
    protein?: number;
  };
};

export function useWeeklyPlanner() {
  const [isMounted, setIsMounted] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleState>({});
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState<CardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const weekDates = useMemo(() => getCurrentWeek(), []);
  const initialLoadRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 8,
      },
    }),
  );

useEffect(() => {
  async function fetchData() {
    setIsLoading(true);

    try {
      const [plannerRes, recipesRes] = await Promise.all([
        fetch("/api/planner"),
        fetch("/api/recipes/user"),
      ]);

      if (plannerRes.ok) {
        const plannerData = await plannerRes.json();
        setSchedule(plannerData.schedule || {});
      }

      if (!recipesRes.ok) throw new Error("Failed to fetch user recipes");

      const recipesData = await recipesRes.json();

      if (recipesData.recipes) {
        const mappedRecipes: CardItem[] = (recipesData.recipes as PlannerRecipe[]).map((r) => ({
          id: r._id,
          title: r.name,
          category: r.category,
          calories: r.nutritionPerServing?.calories
            ? Math.round(r.nutritionPerServing.calories)
            : Math.round((r.totalNutrition?.calories || 0) / (r.servings || 1)),
          protein: r.nutritionPerServing?.protein
            ? Math.round(r.nutritionPerServing.protein)
            : Math.round((r.totalNutrition?.protein || 0) / (r.servings || 1)),
          time: `${(r.prepTime || 0) + (r.cookTime || 0)} min`,
          minutes: (r.prepTime || 0) + (r.cookTime || 0),
          image: r.imageUrl || r.image || "/images/salad.jpeg",
        }));

        setRecipes(mappedRecipes);
      }

      
    } catch (error) {
      console.error("Failed to fetch planner data:", error);
    } finally {
      setIsLoading(false);
      setIsMounted(true);
      initialLoadRef.current = true;
    }
  }

  fetchData();
}, []);
  // Auto-save to backend
  useEffect(() => {
    if (!initialLoadRef.current) return;

    const savePlanner = async () => {
      try {
        await fetch("/api/planner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schedule }),
        });
      } catch (error) {
        console.error("Failed to save planner:", error);
      }
    };

    const timeoutId = setTimeout(savePlanner, 1000); // Debounce save
    return () => clearTimeout(timeoutId);
  }, [schedule]);

  // Computed state
  const visibleCards = useMemo(
    () => filterCards(recipes, search),
    [recipes, search],
  );
  const unscheduledCards = useMemo(
    () => getUnscheduledCards(visibleCards, schedule),
    [visibleCards, schedule],
  );

  // Actions
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const dateKey = String(over.id);

    setSchedule((prev) => moveCard(prev, cardId, dateKey));
  }, []);

  const handleRemove = useCallback((dateKey: string, cardId: string) => {
    setSchedule((prev) => removeCard(prev, dateKey, cardId));
  }, []);

  const handleAdd = useCallback((dateKey: string, cardId: string) => {
    setSchedule((prev) => moveCard(prev, cardId, dateKey));
  }, []);

  return {
    isMounted,
    isLoading,
    schedule,
    search,
    setSearch,
    weekDates,
    visibleCards,
    unscheduledCards,
    handleDragEnd,
    handleRemove,
    handleAdd,
    sensors,
    mockCards: recipes,
  };
}
