import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { pingAPI } from "../src/apis/ProtectedRoute.Api";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("signin_token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    let isMounted = true;

    const checkToken = async () => {
      try {
        await pingAPI();
      } catch (err) {
        console.log("Token failed --->", err);

        // handle expired or invalid token
        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem("signin_token");
          window.location.reload();
        }

        if (isMounted) navigate("/", { replace: true });
        return;
      }

      if (isMounted) setLoading(false);
    };

    checkToken();

    return () => {
      isMounted = false; // cleanup in case component unmounts
    };
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="col-span-full h-screen flex justify-center items-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
