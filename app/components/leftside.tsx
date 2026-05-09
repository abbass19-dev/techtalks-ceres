import Image from "next/image";

export default function Leftside() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-[#006c49] overflow-hidden">
      <Image
        src="/images/Leftside.png"
        alt="Healthy"
        fill
        priority
        className="object-cover mix-blend-multiply opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#006c49]/90 to-[#10b981]/70" />

      <div className="relative z-10 flex flex-col h-full p-12 lg:p-16 text-white">
        <div className="mt-4">
          <h1 className="text-3xl font-extrabold tracking-tight">CÉRES</h1>
          <div className="h-1 w-12 bg-[#6ffbbe] mt-3 rounded-full"></div>
        </div>
        <div className="flex-1 flex items-center">
          <h2 className="text-[3rem] leading-tight font-bold max-w-lg">
            Your Digital
            <br />
            Apothecary.
          </h2>
        </div>

      </div>
    </div>
  );
}