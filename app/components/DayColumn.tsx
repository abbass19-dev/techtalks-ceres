"use client";

import { useDroppable } from "@dnd-kit/core";
import type { CardItem } from "@/lib/utils/Types";
import PlannerCard from "./PlannerCard";
import { formatDate } from "@/lib/utils/plannerUtils";
import { useState, useMemo } from "react";
import { UtensilsCrossed } from "lucide-react";

export default function DayColumn({
  date,
  items,
  allCards,
  onRemove,
  onAdd,
  unscheduledCards,
  dailyGoals,
}: {
  date: Date;
  items: string[];
  allCards: CardItem[];
  onRemove: (dateKey: string, cardId: string) => void;
  onAdd: (dateKey: string, cardId: string) => void;
  unscheduledCards: CardItem[];
  dailyGoals?: { calories: number; protein: number };
}) {
  const dateKey = formatDate(date);
  const { isOver, setNodeRef } = useDroppable({
    id: dateKey,
  });

  const dayName = date
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();
  const monthDay = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const dayCards = items
    .map((id) => allCards.find((card) => card.id === id))
    .filter(Boolean) as CardItem[];

  const totalCalories = dayCards.reduce((sum, card) => sum + card.calories, 0);
  const totalProtein = dayCards.reduce((sum, card) => sum + card.protein, 0);
  const calGoal = dailyGoals?.calories || 2000;
  const proGoal = dailyGoals?.protein || 120;
  const [open, setOpen] = useState(false);
  const CARDS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(unscheduledCards.length / CARDS_PER_PAGE);
  const today = new Date();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const TODAY_COLUMN_CLASS =
    "border-[#00A859] bg-gradient-to-b from-emerald-50/80 to-white shadow-sm ring-1 ring-emerald-100";

  const NORMAL_COLUMN_CLASS =
    "border-slate-200 bg-white hover:border-slate-300";

  const DRAG_OVER_COLUMN_CLASS =
    "border-[#00A859] bg-emerald-50 shadow-md ring-2 ring-[#00A859]/20";

  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;
    return unscheduledCards.slice(start, end);
  }, [unscheduledCards, currentPage]);

  function handleClose() {
    setOpen(false);
    setCurrentPage(1);
  }

  return (
    <div
      ref={setNodeRef}
      className={`h-full rounded-[20px] border p-3 transition md:p-3.5 ${
        isOver
          ? DRAG_OVER_COLUMN_CLASS
          : isToday
            ? TODAY_COLUMN_CLASS
            : NORMAL_COLUMN_CLASS
      }`}
    >
      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {dayName}
        </p>
        <p className="mt-1 text-lg font-bold text-slate-900">{monthDay}</p>
      </div>
      <div className="mb-3 space-y-2 rounded-[16px] bg-slate-50 p-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>DAILY</span>
          <span className="font-semibold text-slate-700">
            {dayCards.length > 0 ? "PLANNED" : "OPEN"}
          </span>
        </div>
        <div>
          <div className="mb-2 text-[10px] uppercase text-slate-400">
            <span className="mb-1 block">Calories</span>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-slate-700">
                {totalCalories}
              </span>
              <span className="text-[9px] text-slate-400">
                / {calGoal} kcal
              </span>
            </div>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200">
            <div
              className={`h-1.5 rounded-full transition-all ${
                totalCalories > calGoal ? "bg-red-400" : "bg-cyan-400"
              }`}
              style={{
                width: `${Math.min((totalCalories / calGoal) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
        <div>
          <div className="mb-2 text-[10px] uppercase text-slate-400">
            <span className="mb-1 block">Protein</span>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-slate-700">
                {totalProtein} g
              </span>
              <span className="text-[9px] text-slate-400">/ {proGoal}g</span>
            </div>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200">
            <div
              className={`h-1.5 rounded-full transition-all ${
                totalProtein > proGoal ? "bg-red-400" : "bg-emerald-400"
              }`}
              style={{
                width: `${Math.min((totalProtein / proGoal) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {dayCards.length === 0 ? (
          <button
            className="flex h-[104px] w-full flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-slate-300 bg-slate-50 text-[11px] text-slate-400 hover:border-green-300 hover:bg-green-100 hover:text-green-700"
            onClick={() => setOpen(true)}
          >
            <UtensilsCrossed className="h-5 w-5" />
            <span>PLAN DAY</span>
          </button>
        ) : (
          <>
            {dayCards.map((card) => (
              <div key={`${dateKey}-${card.id}`} className="group relative">
                <PlannerCard
                  item={card}
                  small
                  scheduled
                  onRemove={onRemove}
                  dateKey={dateKey}
                />
              </div>
            ))}
            <button
              className="flex h-[104px] w-full flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-slate-300 bg-slate-50 text-[11px] text-slate-400 hover:border-green-300 hover:bg-green-100 hover:text-green-700"
              onClick={() => setOpen(true)}
            >
              <UtensilsCrossed className="h-5 w-5" />
              <span>PLAN</span>
            </button>
          </>
        )}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-lg">
            {unscheduledCards.length === 0 ? (
              <div className="rounded-[16px] border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
                No matching recipes found.
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {paginatedCards.map((item) => (
                    <div key={item.id}>
                      <PlannerCard
                        item={item}
                        small
                        onAdd={onAdd}
                        dateKey={dateKey}
                      />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Prev
                    </button>

                    <span className="text-sm text-slate-600">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

            <button
              onClick={handleClose}
              className="mt-4 rounded-lg bg-green-800 w-full py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
