"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, ClipboardEvent, KeyboardEvent, useMemo, useRef, useState } from "react";

const OTP_LENGTH = 6;

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isComplete = useMemo(() => otp.every((digit) => digit !== ""), [otp]);

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

    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
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
    <main className="min-h-screen bg-[#F5F5F5]">
      <section className="grid min-h-screen w-full bg-white md:grid-cols-[520px_1fr]">
        
        {/* LEFT IMAGE */}
        <div className="relative h-screen w-full">
          <Image
            src="/images/otpimage.png"
            alt="CÉRES OTP visual"
            fill
            priority
            className="object-cover object-[center_20%]"
          />
        </div>

       
        <div className="flex items-center justify-center px-6 py-12 md:px-10">
          <div className="w-full max-w-[420px] text-center">
            
            <h1 className="text-[32px] font-medium leading-tight text-[#1A1A1A] md:text-[36px]">
              Verify Your Account
            </h1>

            <p className="mx-auto mt-4 max-w-[320px] text-[13px] leading-[1.5] text-[#8E8E8E]">
              We&apos;ve sent a 6-digit verification code to your registered Lebanese mobile number{" "}
              <span className="font-semibold text-[#5A5A5A]">+961 ** *** 456</span>
            </p>

            {/* OTP INPUTS */}
            <div className="mt-10 flex items-center justify-center gap-3">
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
                  className="h-[56px] w-[56px] rounded-full bg-[#D9D9D9] text-center text-[20px] font-semibold text-[#1A1A1A] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#06B159]/20"
                />
              ))}
            </div>

            {/* BUTTON */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isComplete}
              className="mt-12 inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#06B159] px-6 text-[20px] font-semibold text-black transition hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Verify &amp; Continue
            </button>

            {/* LINKS */}
            <p className="mt-5 text-[14px] text-[#4D4D4D]">
              Didn&apos;t receive a code?{" "}
              <button className="font-medium text-[#245CFF] hover:underline">
                Resend OTP
              </button>
            </p>

            <div className="mt-4">
              <Link
                href="/signin"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-[#1A1A1A] hover:opacity-75"
              >
                ← Back to Sign In
              </Link>
            </div>

          </div>
        </div>

      </section>
    </main>
  );
}