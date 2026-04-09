"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useMemo,
  useRef,
  useState,
} from "react";

const OTP_LENGTH = 6;

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isComplete = useMemo(
    () => otp.every((digit) => digit !== ""),
    [otp]
  );

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value[value.length - 1];
    setOtp(newOtp);

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedData) return;

    const newOtp = Array(OTP_LENGTH).fill("");

    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = () => {
    if (!isComplete) return;

    const otpCode = otp.join("");
    console.log("OTP Submitted:", otpCode);
  };

  return (
    <main className="h-screen w-full flex flex-col lg:flex-row overflow-hidden">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 h-[40vh] lg:h-full relative">
        <Image
          src="/images/otpimage.png"
          alt="CÉRES OTP visual"
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 h-[60vh] lg:h-full flex items-center justify-center px-6 sm:px-12 bg-white">

        <div className="w-full max-w-[420px] text-center">

          <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-medium text-[#1A1A1A]">
            Verify Your Account
          </h1>

          <p className="mx-auto mt-3 max-w-[320px] text-[12px] text-[#8E8E8E] sm:text-[13px]">
            We&apos;ve sent a 6-digit verification code to your registered Lebanese mobile number{" "}
            <span className="font-semibold text-[#5A5A5A]">
              +961 ** *** 456
            </span>
          </p>

          {/* OTP */}
          <div className="mx-auto mt-6 grid w-full max-w-[320px] grid-cols-6 gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="aspect-square w-full rounded-full bg-[#D9D9D9] text-center font-semibold focus:ring-2 focus:ring-[#06B159]/20"
              />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="mt-6 w-full h-[48px] rounded-full bg-[#06B159] font-semibold text-white disabled:opacity-60"
          >
            Verify & Continue
          </button>

          <p className="mt-4 text-sm">
            Didn’t receive a code?{" "}
            <span className="text-blue-600 cursor-pointer">Resend OTP</span>
          </p>

          <Link href="/signin" className="block mt-3 text-sm">
            ← Back to Sign In
          </Link>

        </div>
      </div>
    </main>
  );
}