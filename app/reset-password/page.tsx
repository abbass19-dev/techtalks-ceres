"use client";
import Link from "next/link";
import Image from "next/image";
import Leftside from "../components/leftside";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [debugLink, setDebugLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (loading) return;
    setLoading(true);

    try {
      if (token) {
        if (!password || !confirmPassword) {
          setError("Please fill in both password fields.");
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        });

        const result = await response.json();
        if (!response.ok) {
          setError(result.error || "Unable to reset password.");
        } else {
          setStatus(result.message || "Password updated successfully.");
          setPassword("");
          setConfirmPassword("");
        }
      } else {
        if (!email) {
          setError("Please enter your email address.");
          return;
        }

        const response = await fetch("/api/auth/forget-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();
        if (!response.ok) {
          setError(result.error || "Unable to send reset email.");
        } else {
          setStatus(
            result.message ||
              "If that email exists, a reset link has been sent.",
          );
          setEmail("");
          setDebugLink(result.debugLink || "");
          if (result.emailError) {
            setError(result.emailError);
          }
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isResetMode = Boolean(token);
  const heading = isResetMode ? "Set New Password" : "Reset Password";
  const description = isResetMode
    ? "Enter your new password to update your account."
    : "Enter the email associated with your account and we'll send you password reset instructions.";
  const buttonLabel = isResetMode ? "Change Password" : "Send Email";

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      <Leftside />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-100 flex flex-col items-center">
          <Image src="/assets/logo.png" alt="Logo" width={150} height={150} />

          <div className="text-center mb-8 w-full">
            <h1 className="text-[30px] font-medium text-gray-900 mb-3">
              {heading}
            </h1>
            <p className="text-[13px] text-slate-500 max-w-70 mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            {!isResetMode ? (
              <div className="flex flex-col space-y-1.5 w-full">
                <label htmlFor="email" className="text-sm text-gray-700 ml-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#00A859] focus:bg-white transition-all text-gray-800 placeholder:text-gray-400 shadow-sm"
                  placeholder="you@example.com"
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col space-y-1.5 w-full">
                  <label
                    htmlFor="password"
                    className="text-sm text-gray-700 ml-1"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#00A859] focus:bg-white transition-all text-gray-800 placeholder:text-gray-400 shadow-sm"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="flex flex-col space-y-1.5 w-full">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm text-gray-700 ml-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#00A859] focus:bg-white transition-all text-gray-800 placeholder:text-gray-400 shadow-sm"
                    placeholder="Confirm new password"
                  />
                </div>
              </>
            )}

            {error && (
              <p className="text-red-500 text-sm bg-red-100 p-3 rounded-[15px] mt-2 text-center">
                {error}
              </p>
            )}
            {status && (
              <p className="text-green-700 text-sm bg-green-100 p-3 rounded-[15px] mt-2 text-center">
                {status}
              </p>
            )}
            {debugLink && (
              <div className="text-sm bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-[15px] mt-2 wrap-break-word">
                <p className="font-semibold">Debug reset link:</p>
                <a href={debugLink} className="text-[#3b82f6]" target="_blank" rel="noreferrer">
                  {debugLink}
                </a>
              </div>
            )}

            <div className="pt-2 w-full">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-[#00A859] hover:bg-[#00964D] text-white font-bold rounded-full shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A859] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Please wait..." : buttonLabel}
              </button>
            </div>
          </form>

          <div className="mt-8 text-[15px] text-gray-800">
            Return to{" "}
            <Link
              href="/signin"
              className="text-[#3b82f6] font-medium hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
