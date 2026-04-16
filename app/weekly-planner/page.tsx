"use client";

import Navbar from "@/app/components/Navbar";
import DayColumn from "@/app/components/DayColumn";
import Link from "next/link";
import PlannerCard from "@/app/components/PlannerCard";
import PlannerSummary from "@/app/components/PlannerSummary";
import { getWeekRangeLabel, formatDate } from "@/lib/utils/plannerUtils";
import { useWeeklyPlanner } from "@/hooks/useWeeklyPlanner";
import { DndContext } from "@dnd-kit/core";

export default function WeeklyPlanner() {
  const {
    isMounted,
    schedule,
    search,
    setSearch,
    weekDates,
    unscheduledCards,
    handleDragEnd,
    handleRemove,
    handleAdd,
    sensors,
    mockCards,
  } = useWeeklyPlanner();

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] px-3 py-4 sm:px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-4 rounded-[22px] border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-5 md:px-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Weekly Apothecary Planner
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="min-h-screen bg-[#f5f7fb] px-3 py-4 sm:px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-4 rounded-[22px] border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-5 md:px-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Weekly Apothecary Planner
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Precision-crafted nutrition for the week of{" "}
                {getWeekRangeLabel(weekDates)}
              </p>
            </div>

            <PlannerSummary
              weekDates={weekDates}
              schedule={schedule}
              cards={mockCards}
            />

            <div className="mt-5 grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
              <div className="hidden md:block">
                <aside className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-4">
                    <h2 className="text-base font-bold text-slate-900">
                      Recipe Bank
                    </h2>
                  </div>

                  <div className="relative mb-4">
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search prescriptions..."
                      className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      🔍
                    </span>
                  </div>

                  <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                    {unscheduledCards.length === 0 ? (
                      <div className="rounded-[16px] border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
                        No matching recipes found.
                      </div>
                    ) : (
                      unscheduledCards.map((item) => (
                        <PlannerCard key={item.id} item={item} small />
                      ))
                    )}
                  </div>
                  <Link href="/create-recipe">
                    <button className="mt-4 w-full rounded-[14px] border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                      + Create New Recipe
                    </button>
                  </Link>
                </aside>
              </div>

              <main className="min-w-0 rounded-[22px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Calendar View
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Drag recipes into each day column
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      7 Days
                    </span>
                    <span className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white">
                      Drag & Drop
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto pb-2">
                  <div className="grid min-w-[980px] grid-cols-7 gap-3">
                    {weekDates.map((date) => {
                      const dateKey = formatDate(date);
                      return (
                        <DayColumn
                          key={dateKey}
                          date={date}
                          items={schedule[dateKey] || []}
                          allCards={mockCards}
                          onRemove={handleRemove}
                          onAdd={handleAdd}
                          unscheduledCards={unscheduledCards}
                        />
                      );
                    })}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </DndContext>
    </>
  );
}
