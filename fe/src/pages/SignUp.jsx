import { useState } from "react";
import { NavLink } from "react-router-dom";
import useSignUp from "../hooks/useSignUp";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { handleSubmit, loading, error } = useSignUp(
    email,
    password,
    confirmPassword,
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Login here
          </NavLink>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
