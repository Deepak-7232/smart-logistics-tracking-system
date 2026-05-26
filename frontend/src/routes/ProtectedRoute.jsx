import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useRef, useEffect } from "react";


export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuth, user } = useAuth();
  const toastFiredRef = useRef(false);

  const isRoleAllowed =
    !allowedRoles ||
    allowedRoles.length === 0 ||
    allowedRoles.includes(user?.role);

  useEffect(() => {
    if (isAuth && !isRoleAllowed && !toastFiredRef.current) {
      toastFiredRef.current = true;
      toast.error(
        `🔒 Access Denied — ${user?.role ?? "your role"} cannot access this page.`,
        { autoClose: 4000 }
      );
    }
  }, [isAuth, isRoleAllowed, user?.role]);

  if (!isAuth) return <Navigate to="/" replace />;
  if (!isRoleAllowed) return <Navigate to="/unauthorized" replace />;

  return children;
}
