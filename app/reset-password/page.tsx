import Link from "next/link";
import Image from "next/image";
import Leftside from "../components/leftside";
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      <Leftside />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px] flex flex-col items-center">
          <Image src="/assets/logo.png" alt="Logo" width={150} height={150} />

          <div className="text-center mb-8 w-full">
            <h1 className="text-[30px] font-medium text-gray-900 mb-3">
              Reset Password
            </h1>
            <p className="text-[13px] text-slate-500 max-w-[280px] mx-auto leading-relaxed">
              Enter the email associated with your account and we'll send you
              password reset instructions
            </p>
          </div>

          <form className="w-full space-y-4">
            <div className="flex flex-col space-y-1.5 w-full">
              <label htmlFor="email" className="text-sm text-gray-700 ml-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#00A859] focus:bg-white transition-all text-gray-800 placeholder:text-gray-400 shadow-sm"
              />
            </div>

            <div className="pt-2 w-full">
              <button
                type="submit"
                className="w-full py-4 mt-2 bg-[#00A859] hover:bg-[#00964D] text-white font-bold rounded-full shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A859] active:scale-[0.98]"
              >
                Send Email
              </button>
            </div>
          </form>

          <div className="mt-8 text-[15px] text-gray-800">
            Return to{" "}
            <Link
              href="/login"
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
