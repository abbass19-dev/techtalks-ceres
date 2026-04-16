import type { CardItem, ScheduleState } from "@/lib/utils/Types";
import { formatDate } from "@/lib/utils/plannerUtils";

export default function PlannerSummary({
  weekDates,
  schedule,
  cards,
}: {
  weekDates: Date[];
  schedule: ScheduleState;
  cards: CardItem[];
}) {
  const weeklyTotal = weekDates.reduce(
    (totals, date) => {
      const dateKey = formatDate(date);
      const dayCards = (schedule[dateKey] || [])
        .map((id) => cards.find((card) => card.id === id))
        .filter(Boolean) as CardItem[];

      totals.calories += dayCards.reduce((sum, card) => sum + card.calories, 0);
      totals.protein += dayCards.reduce((sum, card) => sum + card.protein, 0);
      return totals;
    },
    { calories: 0, protein: 0 },
  );

  const daysPlanned = weekDates.filter((date) => {
    const dateKey = formatDate(date);
    return (schedule[dateKey] || []).length > 0;
  }).length;

  const mealsRemaining = cards.filter(
    (card) => !Object.values(schedule).flat().includes(card.id),
  ).length;

  const items = [
    { label: "Weekly Calories", value: `${weeklyTotal.calories}` },
    { label: "Weekly Protein", value: `${weeklyTotal.protein}g` },
    { label: "Days Planned", value: `${daysPlanned}` },
    { label: "Meals Remaining", value: `${mealsRemaining}` },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            {item.label}
          </p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
