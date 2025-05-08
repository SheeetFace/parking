import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("accessToken"));
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
