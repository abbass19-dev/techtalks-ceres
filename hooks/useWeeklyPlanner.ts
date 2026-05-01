import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { ScheduleState, CardItem } from "@/lib/utils/Types";
import { getCurrentWeek, filterCards, getUnscheduledCards, moveCard, removeCard } from "@/lib/utils/plannerUtils";

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
        const recipesRes = await fetch("/api/recipes?userOnly=true");
        const recipesData = await recipesRes.json();

        if (recipesData.recipes) {
          const mappedRecipes: CardItem[] = recipesData.recipes.map(
            (r: any) => ({
              id: r._id,
              title: r.name,
              category: r.category,
              calories: r.nutritionPerServing?.calories ? Math.round(r.nutritionPerServing.calories) : Math.round((r.totalNutrition?.calories || 0) / (r.servings || 1)),
              protein: r.nutritionPerServing?.protein ? Math.round(r.nutritionPerServing.protein) : Math.round((r.totalNutrition?.protein || 0) / (r.servings || 1)),
              time: `${(r.prepTime || 0) + (r.cookTime || 0)} min`,
              minutes: (r.prepTime || 0) + (r.cookTime || 0),
              image: r.imageUrl || r.image || "/images/recipe-placeholder.jpg",
            }),
          );
          setRecipes(mappedRecipes);
        }

        const plannerRes = await fetch("/api/planner");
        const plannerData = await plannerRes.json();
        if (plannerData.schedule) {
          setSchedule(plannerData.schedule);
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
