import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-4">
      <div className="relative mt-5 mb-5 mx-auto flex max-w-[1640px] items-center px-4 sm:px-6 md:px-16">
        <div className="absolute left-4 sm:left-6 md:left-16">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={110}
            height={60}
            className="object-contain"
          />
        </div>
        <p className="mx-auto text-center text-xs text-gray-500 sm:text-sm">
          © {new Date().getFullYear()} CÉRES. All rights reserved.
        </p>
      </div>
    </footer>
  );
}