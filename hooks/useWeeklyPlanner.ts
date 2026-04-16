import { useState, useEffect, useMemo, useCallback } from "react";
import {DragEndEvent,PointerSensor,TouchSensor,useSensor,useSensors,} from "@dnd-kit/core";
import { ScheduleState } from "@/lib/utils/Types";
import {getCurrentWeek,formatDate,filterCards,getUnscheduledCards,moveCard,removeCard,} from "@/lib/utils/plannerUtils";
import { mockCards } from "@/lib/data/mockData";

export function useWeeklyPlanner() {
  const [isMounted, setIsMounted] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleState>({});
  const [search, setSearch] = useState("");

  const weekDates = useMemo(() => getCurrentWeek(), []);

  // Initialize sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 8,
      },
    }),
  );

  // Load from localeStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("apothecary-schedule");
    if (saved) {
      try {
        setSchedule(JSON.parse(saved));
      } catch (e) {
        console.error("Could not load planner state", e);
      }
    } else {
      setSchedule({
        [formatDate(weekDates[0])]: ["meal-5"],
        [formatDate(weekDates[1])]: ["meal-6", "meal-1", "meal-2"],
      });
    }
  }, [weekDates]);

  // Save to localStorage on changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("apothecary-schedule", JSON.stringify(schedule));
    }
  }, [schedule, isMounted]);

  // Computed state
  const visibleCards = useMemo(() => filterCards(mockCards, search), [search]);
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
    mockCards,
  };
}
