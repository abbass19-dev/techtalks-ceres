import type { CardItem, ScheduleState } from "@/lib/utils/Types";

export function getWeekRangeLabel(weekDates: Date[]) {
  const first = weekDates[0];
  const last = weekDates[weekDates.length - 1];

  const firstLabel = first.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const lastLabel = last.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${firstLabel} - ${lastLabel}`;
}

export function getCurrentWeek() {
  const today = new Date();
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function formatDate(date: Date | string) {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  if (isNaN(parsedDate.getTime())) {
    return "";
  }

  if (typeof date === "string") {
    return parsedDate.toLocaleString("en-US", {
      timeZone: "Asia/Beirut",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return parsedDate.toISOString().split("T")[0];
}

export function filterCards(cards: CardItem[], search: string) {
  const query = search.trim().toLowerCase();

  return cards.filter((card) => {
    return (
      card.title.toLowerCase().includes(query) ||
      card.category.toLowerCase().includes(query)
    );
  });
}

export function getUnscheduledCards(
  cards: CardItem[],
  schedule: ScheduleState,
) {
  return cards.filter((card) => {
    return !Object.values(schedule).some((ids) => ids.includes(card.id));
  });
}

export function moveCard(
  schedule: ScheduleState,
  cardId: string,
  dateKey: string,
): ScheduleState {
  const updated: ScheduleState = { ...schedule };

  // Remove card from all existing days
  for (const key in updated) {
    updated[key] = (updated[key] || []).filter((id) => id !== cardId);
  }

  // Add to the target day
  updated[dateKey] = [...(updated[dateKey] || []), cardId];
  return updated;
}

export function removeCard(
  schedule: ScheduleState,
  dateKey: string,
  cardId: string,
): ScheduleState {
  return {
    ...schedule,
    [dateKey]: (schedule[dateKey] || []).filter((id) => id !== cardId),
  };
}
