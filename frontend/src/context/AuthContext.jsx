import { createContext, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import useAuthStore, { isTokenValid, decodeJwt } from "../store/useAuthStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const store = useAuthStore();
  const warningShownRef = useRef(false);

  // On mount: evict expired tokens so protected routes redirect correctly
  useEffect(() => {
    store.restoreSession();

    const interval = setInterval(() => {
      const { token, isAuth } = useAuthStore.getState();
      if (!isAuth || !token) return;

      const payload = decodeJwt(token);
      if (!payload?.exp) return;

      const timeLeft = payload.exp * 1000 - Date.now();

      // Auto-logout if token is expired
      if (timeLeft <= 0) {
        useAuthStore.getState().logout();
        toast.info("Your session has expired. Please sign in again.");
        window.location.href = "/";
        return;
      }

      // Warn if less than 5 minutes remain
      if (timeLeft <= 5 * 60 * 1000 && !warningShownRef.current) {
        toast.warn("⏱ Your session expires in less than 5 minutes. Please save your work.", {
          autoClose: 10000,
        });
        warningShownRef.current = true;
      }
    }, 30000); // check every 30 seconds

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook — consume auth from any component */
export function useAuth() {
  return useContext(AuthContext);
}

export { isTokenValid };
