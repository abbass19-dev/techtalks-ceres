"use client";
import Link from "next/link";
import Image from "next/image";
import Leftside from "../components/leftside";
import { ChangeEvent, FormEvent, useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setSuccess("Account created successfully. Redirecting...");
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
      <Leftside />
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="w-full max-w-[400px] flex flex-col items-center">
          <Image src="/assets/logo.png" alt="Logo" width={130} height={130} />

          <div className="text-center mb-4 w-full">
            <h1 className="text-[24px] md:text-[26px] font-medium text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-[12px] text-slate-500 max-w-[250px] mx-auto leading-relaxed">
              Join CÉRES and start managing your health data with precision.
            </p>
          </div>

          <form className="w-full space-y-3" onSubmit={handleSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col space-y-1.5 w-full">
                <label
                  htmlFor="firstName"
                  className="text-sm text-gray-700 ml-1"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#00A859] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 shadow-sm"
                  placeholder="Jane"
                />
              </div>

              <div className="flex flex-col space-y-1.5 w-full">
                <label
                  htmlFor="lastName"
                  className="text-sm text-gray-700 ml-1"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#00A859] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 shadow-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5 w-full">
              <label htmlFor="email" className="text-sm text-gray-700 ml-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#00A859] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 shadow-sm"
                placeholder="jane.doe@example.com"
              />
            </div>

            <div className="flex flex-col space-y-1.5 w-full">
              <label htmlFor="password" className="text-sm text-gray-700 ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#00A859] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 shadow-sm"
                placeholder="Create a strong password"
              />
            </div>

            <div className="flex flex-col space-y-1.5 w-full">
              <label
                htmlFor="phoneNumber"
                className="text-sm text-gray-700 ml-1"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#00A859] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 shadow-sm"
                placeholder="81 132 465"
              />
            </div>

            {error ? (
              <p className="text-red-500 text-sm bg-red-100 p-3 rounded-[15px] text-center">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="text-green-700 text-sm bg-green-100 p-3 rounded-[15px] text-center">
                {success}
              </p>
            ) : null}

            <div className="pt-2 w-full">
              <button
                type="submit"
                className="w-full py-3 mt-1 bg-[#00A859] hover:bg-[#00964D] text-white font-bold rounded-full shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A859] active:scale-[0.98]"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6 text-[14px] text-gray-800">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#3b82f6] font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
