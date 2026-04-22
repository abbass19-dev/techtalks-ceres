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
  Heart,
  MoreHorizontal,
  X,
} from "lucide-react";
import { NavbarUser } from "@/lib/utils/Types";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Community", href: "/community-recipes", icon: Users },
  { label: "Add Recipe", href: "/add-recipe", icon: PlusSquare },
  { label: "Weekly Planner", href: "/weekly-planner", icon: CalendarDays },
  { label: "Calculator", href: "/calorie-calculator", icon: Calculator },
  { label: "My Recipes", href: "/my-recipes", icon: History },
  { label: "Saved Recipes", href: "/saved-recipes", icon: Heart },
];

const primaryLinks = links.slice(0, 4);
const moreLinks = links.slice(4);

export default function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [user, setUser] = useState<NavbarUser | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenMore(false);
  }, [pathname]);

  return (
    <>
      <nav className="sticky top-0  z-50 hidden border-b border-green-100 bg-white backdrop-blur-sm md:block">
        <div className="mx-auto flex w-full items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
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
                <li key={link.label} className="group relative">
                  <Link
                    href={link.href}
                    className={`pb-1 transition-colors ${
                      isActive
                        ? "text-[#00A859]"
                        : "text-slate-600 hover:text-[#00A859]"
                    }`}
                  >
                    {link.label}
                  </Link>
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] rounded-full bg-[#00A859] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
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
                alt={displayUser.firstName}
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
        <div className="flex items-center justify-around px-2 py-2">
          {primaryLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium transition ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-slate-500 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <Icon size={20} />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setOpenMore((prev) => !prev)}
            className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium transition ${
              openMore
                ? "bg-green-50 text-green-700"
                : "text-slate-500 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            <MoreHorizontal size={20} />
            <span>More</span>
          </button>
        </div>
      </nav>

      {openMore && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setOpenMore(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute bottom-16 left-0 right-0 rounded-t-3xl bg-white px-4 pt-4 pb-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />

            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <Image
                src={displayUser.image}
                alt={displayUser.firstName}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {displayUser.firstName} {displayUser.lastName}
                </p>
                <p className="text-xs text-slate-500">{displayUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {moreLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-2 py-4 text-xs font-medium transition ${
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-50 text-slate-600 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-center leading-tight">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-3 flex flex-col gap-1">
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Settings size={18} />
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
