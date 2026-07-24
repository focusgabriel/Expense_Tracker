/** @format */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import refreshClient from "../api/fetch";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const emailVerify = async () => {
      try {
        const res = await refreshClient.get(`/auth/verify-email/${token}`);
        setSuccess(true);
        setErrorMsg(res.data.message);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        setSuccess(false);
        setErrorMsg("Verification Failed...");
      } finally {
        setLoading(false);
      }
    };

    emailVerify();
  }, [token]);

  if (loading) {
    return <h2>Verifying your email...</h2>;
  }

  return (
    <section className="flex h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1
          className={`text-2xl font-bold ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {success ? "Success!" : "Oops!"}
        </h1>

        <p className="mt-4">{errorMsg}</p>
      </div>
    </section>
  );
};

export default VerifyEmail;
