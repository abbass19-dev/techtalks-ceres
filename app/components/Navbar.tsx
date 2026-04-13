import Image from "next/image";
import Link from "next/link";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Community Recipes", href: "/community-recipes" },
  { label: "Calorie Calculator", href: "/calorie-calculator" },
  { label: "Add Recipe", href: "/add-recipe" },
  { label: "History", href: "/history" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-green-100 px-12 h-[60px] flex items-center justify-between">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt="CERES logo"
          width={28}
          height={28}
        />
        <span className="text-green-800 font-bold text-lg">CERES</span>
      </Link>

      {/* Nav Links */}
      <ul className="flex gap-7 list-none">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-gray-500 hover:text-green-700 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* User Avatar */}
      <div className="w-9 h-9 rounded-full bg-green-50 border-2 border-green-400 flex items-center justify-center text-green-800 font-semibold text-xs">
        T
      </div>

    </nav>
  );
}