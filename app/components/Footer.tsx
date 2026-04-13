import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-green-100 py-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Image
          src="/images/logo.png"
          alt="CERES logo"
          width={24}
          height={24}
        />
        <span className="text-green-800 font-bold text-base">CERES</span>
      </div>
      <p className="text-sm text-gray-400">2026 CERES. All rights reserved.</p>
    </footer>
  );
}