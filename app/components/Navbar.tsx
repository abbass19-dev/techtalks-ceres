"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calculator,
  PlusSquare,
  History,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  CalendarDays,
} from "lucide-react";
import { NavbarUser } from "@/lib/utils/Types";

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
    label: "Weekly Planner",
    href: "/weekly-planner",
    icon: CalendarDays,
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
  const [user, setUser] = useState<NavbarUser | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      setOpenProfile(false);
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) return;
        const data = await response.json();
        if (data?.user) {
          setUser({
            firstName: `${data.user.firstName}`,
            lastName: `${data.user.lastName}`,
            email: data.user.email,
            image: data.user.image || "/images/logo.png",
          });
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }

    loadUser();
  }, []);

  const displayUser = user ?? {
    firstName: "Account",
    lastName: "",
    email: "",
    image: "/images/logo.png",
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 hidden border-b border-green-100 bg-white backdrop-blur-sm md:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <Link href="/home" className="flex items-center gap-2">
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
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`transition-colors ${
                      isActive
                        ? "font-semibold text-green-700"
                        : "hover:text-green-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setOpenProfile((prev) => !prev)}
              className="flex items-center gap-3 rounded-full border border-green-100 bg-white p-1 pr-3 shadow-sm transition hover:border-green-200"
            >
              <Image
                src={displayUser.image}
                alt={`${displayUser.firstName}`}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-slate-700">
                {displayUser.firstName}
              </span>
              {openProfile ? (
                <ChevronUp className="text-slate-700" size={18} />
              ) : (
                <ChevronDown className="text-slate-700" size={18} />
              )}
            </button>

            {openProfile && (
              <div className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {displayUser.firstName} {displayUser.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{displayUser.email}</p>
                </div>

                <div className="p-2">
                  <Link
                    href="/settings"
                    onClick={() => setOpenProfile(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <Settings size={18} />
                    Settings
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
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
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium transition ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-slate-600 hover:bg-green-50 hover:text-green-700"
                }`}
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