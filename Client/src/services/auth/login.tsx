/** @format */

import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import refreshClient from "../../api/fetch";
import Logo from "../../components/Logo";

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
      const response = await refreshClient.post("/auth/login",AuthUser);

      // const {accessToken, refreshToken, user} = await response.json();
      const data = await response.data;

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      navigate("/overview");

      // return user;
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
          <div className="mb-8 space-y-5">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-600">
              Sign in
            </div>
            <Logo variant="auth" />
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
