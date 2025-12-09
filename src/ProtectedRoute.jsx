import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { pingAPI } from "../src/apis/ProtectedRoute.Api";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("signin_token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // no token → go to login
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const checkToken = async () => {
      try {
        await pingAPI();
      } catch (err) {
        console.log("Token failed --->", err);

        // handle expired or invalid token
        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem("signin_token");
        }

        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="col-span-full h-screen flex justify-center items-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  // If token was invalid, we already navigated. So we only return Outlet if allowed.
  return <Outlet />;
};

export default ProtectedRoute;
