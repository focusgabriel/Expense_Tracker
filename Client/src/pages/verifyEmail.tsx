/** @format */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import refreshClient from "../api/fetch";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const emailVerify = async () => {
      try {
        const res = await refreshClient.get(`/auth/verify-email/${token}`);

        if(!res.data) {
          setErrorMsg("Invalid verification link");
        }

        setSuccess(true);

        setTimeout(() => {
          navigate("/");
        }, 3000);

      } catch (error) {

        setErrorMsg("Verification Failed...");

      } finally {
        setLoading(false);
      }
    };

    emailVerify();
  }, [token]);

  if (loading) {
    return <h2 className="lg:text-2xl text-lg font-medium text-center">Verifying your email...</h2>;
  }

  return (
    <section className="flex h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1
          className={`text-2xl font-bold ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {success ? "Success!" : `Opps! ${errorMsg}`}
        </h1>
      </div>
    </section>
  );
};

export default VerifyEmail;
