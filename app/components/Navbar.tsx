"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calculator,
  PlusSquare,
  History,
  Settings,
  LogOut,
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Community",
    href: "/community-recipes",
    icon: Users,
  },
  {
    label: "Calculator",
    href: "/calorie-calculator",
    icon: Calculator,
  },
  {
    label: "Add Recipe",
    href: "/add-recipe",
    icon: PlusSquare,
  },
  {
    label: "History",
    href: "/history",
    icon: History,
  },
];

export default function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 hidden border-b border-green-100 bg-white/95 backdrop-blur-sm md:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2 lg:px-8">
          <Link href="/" className="flex items-center gap-3 pl-2 sm:pl-4">
            <Image
              src="/images/logo.png"
              alt="CERES logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />

            <span className="text-base font-semibold text-slate-900">
              CERES
            </span>
          </Link>

          <ul className="flex items-center gap-6 text-sm text-slate-600">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-green-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setOpenProfile((prev) => !prev)}
              className="flex items-center gap-3 rounded-full border border-green-100 bg-white p-1 pr-3 shadow-sm transition hover:border-green-200"
            >
              <Image
                src="/images/logo.png"
                alt="User"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-slate-700">Taha</span>
            </button>

            {openProfile && (
              <div className="absolute right-0 top-full mt-3 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">Taha</p>
                  <p className="text-xs text-slate-500">taha@example.com</p>
                </div>

                <div className="p-2">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                    onClick={() => setOpenProfile(false)}
                  >
                    <Settings size={18} />
                    Settings
                  </Link>

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-green-100 bg-white/95 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.label}
                href={link.href}
                className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-700"
              >
                <Icon size={20} />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
