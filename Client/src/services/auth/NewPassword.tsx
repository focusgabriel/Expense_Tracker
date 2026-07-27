/** @format */

import { useRef, useState } from "react";
import refreshClient from "../../api/fetch";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Logo from "../../components/Logo";

const NewPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { token } = useParams();


  const submitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newPassword = {
      password: passwordRef.current?.value,
    };

    try {
      setIsLoading(true);

      const res = await refreshClient.post(
        `/auth/reset-password/${token}`,
        newPassword,
      );

      toast.success("Password updated successfully!", {
        position: "top-right",
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/");
      }, 300);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Reset password failed.", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.error("Reset password failed.", {
          position: "top-right",
          duration: 3000,
        });
      }
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="auth-shell min-h-screen px-0 py-6 sm:px-4 sm:py-10 text-slate-900">
        <div className="auth-shell-bg" />
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] items-center justify-center">
          <div className="w-full max-w-none sm:max-w-md mx-auto overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_40px_90px_-30px_rgba(15,23,42,0.08)] auth-card">
            <div className="mb-8 space-y-5">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-600">
                Password Reset
              </div>
              <Logo variant="auth" />
            </div>

            <form onSubmit={submitForm} className="space-y-5">
              <div className="space-y-3">
                <label htmlFor="password" className="labelClass">
                  Enter new Password
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
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>Submit</>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewPassword;