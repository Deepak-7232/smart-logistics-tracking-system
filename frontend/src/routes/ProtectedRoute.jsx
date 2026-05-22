import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps a route with auth + optional role gate.
 * @param {string} [requiredRole] - e.g. "ADMIN" | "DRIVER" — if omitted, any auth'd user passes
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuth, user } = useAuth();

  if (!isAuth) return <Navigate to="/" replace />;

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
