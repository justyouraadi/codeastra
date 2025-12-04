import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { pingAPI } from "../src/apis/ProtectedRoute.Api";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("signin_token");

  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const checkToken = async () => {
      try {
       const temp =  await pingAPI(); // API uses token internally
       console.log("token check --> ", temp);
        setIsValid(true);
      } catch (err) {
        // Detect expiry with err.status instead of err.response.status
        if (err.status === 403) {
          localStorage.removeItem("signin_token");
        }

        setIsValid(false);
        navigate("/", { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkToken();
  }, [token, navigate]);

  if (isChecking) {
    return (
      <div className="col-span-full h-screen flex justify-center items-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  if (!isValid) return null;

  return <Outlet />;
};

export default ProtectedRoute;
