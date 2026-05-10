"use client";

import { useDraggable } from "@dnd-kit/core";
import type { CardItem } from "@/lib/utils/Types";
import RecipeImage from "./RecipeImage";

export default function PlannerCard({
  item,
  small = false,
  scheduled = false,
  onRemove,
  onAdd,
  dateKey,
}: {
  item: CardItem;
  small?: boolean;
  scheduled?: boolean;
  onRemove?: (dateKey: string, cardId: string) => void;
  onAdd?: (dateKey: string, cardId: string) => void;
  dateKey?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      disabled: !!onAdd,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`touch-none cursor-grab active:cursor-grabbing rounded-[18px] border border-slate-200 bg-white shadow-sm transition ${
        isDragging ? "scale-[1.02] opacity-60" : "opacity-100"
      } ${small ? "p-2.5" : "p-3"}`}
    >
      <div className="flex gap-2.5">
        {!scheduled && item.image && (
          <RecipeImage
            src={item.image}
            alt={item.title}
            width={64}
            height={64}
            className={`shrink-0 rounded-[14px] object-cover ${
              small ? "h-12 w-12 sm:h-14 sm:w-14" : "h-16 w-16"
            }`}
          />
        )}

        <div className="min-w-0 flex-1">
          {scheduled && (
            <div
              className={`mt-0.5 mb-1 flex w-full items-center justify-between ${small ? "h-4" : "h-4"}`}
            >
              <p className="text-[10px] text-green-600">{item.time}</p>
            </div>
          )}
          <p
            className={`wrap-break-word whitespace-normal font-semibold text-slate-900 ${
              small ? "text-[12px]" : "text-sm"
            }`}
          >
            {item.title}
          </p>
          {!scheduled && (
            <p className="mt-0.5 text-[10px] text-slate-500">
              {item.category}· {item.minutes} min
            </p>
          )}
          <div className="mt-1 grid items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-700">
                {item.calories} CAL
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700">
                {item.protein}G
              </span>
            </div>

            {scheduled && onRemove && dateKey && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(dateKey, item.id);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="cursor-pointer rounded-full mt-2 bg-rose-50 px-2.5 py-1 text-[8px] font-black tracking-wider text-rose-600 transition-all hover:bg-rose-600 hover:text-white active:scale-95"
              >
                REMOVE
              </button>
            )}
          </div>{" "}
          {!scheduled && onAdd && dateKey && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAdd(dateKey, item.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="cursor-pointer rounded-full mt-2 bg-emerald-50 px-1.5 py-1.5 w-full text-[9px] font-black tracking-wider text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white active:scale-95"
            >
              + ADD MORE
            </button>
          )}
          {!small && (
            <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-slate-400">
              Drag to schedule
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
