import { useState } from "react";
import { NavLink } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const Login = () => {
  // Changed to email to match backend schema
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Destructuring the enhanced hook
  const { handleSubmit, loading, error } = useLogin(email, password);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo or Icon placeholder */}
        <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
           <span className="text-white font-bold text-xl">P</span>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{" "}
          <NavLink
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            start your 14-day free trial
          </NavLink>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm dark:bg-slate-700 dark:text-white transition-all"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm dark:bg-slate-700 dark:text-white transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <div className="flex">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
              >
                {loading ? "Verifying..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
