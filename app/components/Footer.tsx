import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-4 pb-24 md:pb-4">
      <div className="relative mx-auto flex max-w-7xl items-center px-4 sm:px-6 md:px-16">
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={98}
            height={28}
            className="object-contain"
          />
        </div>

        <p className="absolute left-1/2 -translate-x-1/2 text-xs text-slate-500 sm:text-sm">
          © {new Date().getFullYear()} CÉRES. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
