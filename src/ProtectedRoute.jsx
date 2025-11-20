import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { pingAPI } from "../src/apis/ProtectedRoute.Api";

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
        await pingAPI(); // API uses token internally
        setIsValid(true);
      } catch (err) {
        // ✅ Check for 403 explicitly
        if (err.response && err.response.status === 403) {
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
      <div class="w-full flex items-center justify-center py-10 h-screen">
        <div class="flex flex-col gap-4 items-center justify-center">
          <div class="w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
            <div class="w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isValid) return null;

  return <Outlet />;
};

export default ProtectedRoute;
