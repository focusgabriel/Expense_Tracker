import axios from "axios";
import refreshClient from "../../api/fetch"
import toast from "react-hot-toast";
import { useRef } from "react";
import Logo from "../../components/Logo";

const ForgotPassword = () => {

  const emailRef = useRef<HTMLInputElement>(null);

  const resetSubmit = async(e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const writeEmail = {
      email: emailRef.current?.value.toLowerCase()
    }

    try {
      await refreshClient.post("/auth/forgot-password", writeEmail);

      toast.success("check your email for the password reset link.")

    } catch (error) {
      if(axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "email verification failed.")
      } else {
        "email verification failed."
      }
    }
  }

  
  return (
    <>
      <section className="auth-shell min-h-screen px-0 py-6 sm:px-4 sm:py-10 text-slate-900">
        <div className="auth-shell-bg" />
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] items-center justify-center">
          <div className="w-full max-w-none sm:max-w-md mx-auto overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_40px_90px_-30px_rgba(15,23,42,0.08)] auth-card">
            <div className="mb-8 space-y-5">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-600">
                Reset Password
              </div>
              <Logo variant="auth" />
            </div>

            <form onSubmit={resetSubmit} className="space-y-5">
              <div className="space-y-3">
                <label htmlFor="email" className="labelClass">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  ref={emailRef}
                  placeholder="enter your email"
                  className="fieldClass"
                  required
                />
              </div>

              <button type="submit" className="auth-action-btn">Submit</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default ForgotPassword