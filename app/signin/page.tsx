"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Leftside from "../components/leftside";
import { FormEvent, useState } from "react";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to sign in. Please try again.");
        return;
      }

      router.push("/home");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Signin error:", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      <Leftside />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-100 flex flex-col items-center">
          <Image src="/assets/logo.png" alt="Logo" width={150} height={150} />

          <div className="text-center mb-8 w-full">
            <h1 className="text-[30px] font-medium text-gray-900 mb-3">
              Welcome Back
            </h1>
            <p className="text-[13px] text-slate-500 max-w-70 mx-auto leading-relaxed">
              Please enter your details to sign in to your account
            </p>
          </div>

          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-1.5 w-full">
              <label htmlFor="email" className="text-sm text-gray-700 ml-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#00A859] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5 w-full">
              <label htmlFor="password" className="text-sm text-gray-700 ml-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#00A859] focus:bg-white transition-all text-gray-800 placeholder:text-gray-400 shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p className="text-red-500 text-sm bg-red-100 p-2 rounded-[15px] mt-3 text-center ">
                  {error}
                </p>
              )}
            </div>

            <div className="pt-2 w-full">
              <button
                type="submit"
                className="w-full py-4 mt-2 bg-[#00A859] hover:bg-[#00964D] text-white font-bold rounded-full shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A859] active:scale-[0.98]"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-8 text-[15px] text-gray-800">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[#3b82f6] font-medium hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
