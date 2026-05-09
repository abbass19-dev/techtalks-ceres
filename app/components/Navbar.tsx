"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {LayoutDashboard,Users,Calculator,PlusSquare,History,Settings,LogOut,ChevronDown,ChevronUp,CalendarDays,Heart,MoreHorizontal,} from "lucide-react";
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

export default function Navbar() {
  const [user, setUser] = useState<NavbarUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const primaryLinks = links.slice(0, 4);
  const moreLinks = links.slice(4);

  const getUserImage = (img?: string) =>
    img && img.trim() ? img : "/images/default-user.png";

  const displayUser = user || {
    firstName: "",
    lastName: "",
    email: "",
    image: "/images/default-user.png",
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.user) return;

        setUser({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
        image: getUserImage(data.user.imageUrl),
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeProfile = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };

    window.addEventListener("mousedown", closeProfile);

    return () => window.removeEventListener("mousedown", closeProfile);
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setProfileOpen(false);
    setMoreOpen(false);
    router.push("/signin");
    router.refresh();
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className="sticky top-0 z-[100] hidden w-full transition-all duration-300 lg:block">
        <div
          className={`mx-auto transition-all duration-500 ease-in-out ${
            scrolled
              ? "mt-4 max-w-5xl rounded-full border border-gray-300/90 bg-white/60 px-8 py-4 shadow-lg backdrop-blur-md"
              : "w-full border-b border-gray-100 bg-white px-10 py-3"
          }`}
        >
          <div className="flex items-center justify-between gap-6">
            <Link href="/home" className="flex shrink-0 items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="CERES logo"
                width={110}
                height={110}
                className={`rounded-full object-cover transition-all duration-300
                ${scrolled ? "h-10 w-10" : "h-14 w-14"}`}
              />

              <span
                className={`font-semibold text-slate-900 transition-all ${
                  scrolled ? "text-sm" : "text-base"
                }`}
              >
                CERES
              </span>
            </Link>

            <ul className="flex flex-1 items-center justify-center gap-5 whitespace-nowrap text-sm text-slate-600 xl:gap-8">
              {links.map((link) => (
                <li key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    className={`pb-1 font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-[#00A859]"
                        : "text-slate-600 hover:text-[#00A859]"
                    }`}
                  >
                    {link.label}
                  </Link>

                  <span
                    className={`absolute left-0 -bottom-1 h-[1.5px] rounded-full bg-[#00A859] transition-all duration-300 ${
                      isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </li>
              ))}
            </ul>

            <div ref={profileRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className={`flex items-center gap-3 rounded-full border bg-white shadow-sm transition-all ${
                  scrolled
                    ? "border-transparent p-1.5"
                    : "border-green-100 p-2 pr-3 hover:border-green-200"
                }`}
              >
                <Image
                  src={displayUser.image}
                  alt={displayUser.firstName || "User"}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/default-user.png";
                  }}
                />
                {!scrolled && (
                  <>
                    <span className="text-sm font-medium text-slate-700">
                      {displayUser.firstName || "User"}
                    </span>

                    {profileOpen ? (
                      <ChevronUp size={18} className="text-slate-700" />
                    ) : (
                      <ChevronDown size={18} className="text-slate-700" />
                    )}
                  </>
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {displayUser.firstName} {displayUser.lastName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {displayUser.email}
                    </p>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Settings size={18} />
                      Settings
                    </Link>

                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <nav className="fixed right-0 bottom-0 left-0 z-[100] border-t border-green-100 bg-white/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {primaryLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium transition ${
                  isActive(link.href)
                    ? "bg-green-50 text-green-700"
                    : "text-slate-500 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <Icon size={20} />
                <span className="max-w-full truncate">{link.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen((prev) => !prev)}
            className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium transition ${
              moreOpen
                ? "bg-green-50 text-green-700"
                : "text-slate-500 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            <MoreHorizontal size={20} />
            <span>More</span>
          </button>
        </div>
      </nav>

      {moreOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30" />

          <div
            className="absolute right-0 bottom-16 left-0 rounded-t-3xl bg-white px-4 pt-4 pb-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />

            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <Image
                src={displayUser.image}
                alt={displayUser.firstName || "User"}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/default-user.png";
                }}
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {displayUser.firstName || "User"} {displayUser.lastName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {displayUser.email}
                </p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-3">
              {moreLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-2 py-4 text-xs font-medium transition ${
                      isActive(link.href)
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

            <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
              <Link
                href="/settings"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Settings size={18} />
                Settings
              </Link>

              <button
                type="button"
                onClick={logout}
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
