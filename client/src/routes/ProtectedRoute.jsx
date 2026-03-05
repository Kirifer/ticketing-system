import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/check-auth", {
          method: "GET",
          credentials: "include"
        });
        setIsAuthenticated(res.ok);
      } catch (err) {
        console.log(err);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;