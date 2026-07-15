/** @format */

import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const submitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const AuthUser = {
      email: emailRef.current?.value.toLowerCase(),
      password: passwordRef.current?.value,
    };

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(AuthUser),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Error sending data");
      }

      localStorage.setItem("token", data.token);
      navigate("/overview");
    } catch (error) {
      console.error(error);
    }

    if (emailRef.current) emailRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
  };

  return (
    <section className="auth-shell min-h-screen px-0 py-6 sm:px-4 sm:py-10 text-slate-900">
      <div className="auth-shell-bg" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="w-full max-w-none sm:max-w-md mx-auto overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_40px_90px_-30px_rgba(15,23,42,0.08)] auth-card">
          <div className="mb-8 space-y-4">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">
              Sign in
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Expense Tracker
            </h1>
          </div>

          <form onSubmit={submitForm} className="space-y-5">
            <div className="space-y-3">
              <label htmlFor="email" className="labelClass">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                ref={emailRef}
                placeholder="you@example.com"
                className="fieldClass"
                required
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="labelClass">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                ref={passwordRef}
                placeholder="Enter your password"
                className="fieldClass"
                required
              />
            </div>

            <button type="submit" className="auth-action-btn">
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="auth-footer-link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
