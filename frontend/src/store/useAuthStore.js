import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Safely decode a JWT payload without verifying signature */
function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

/** Returns true if JWT exp claim is in the future */
function isTokenValid(token) {
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user:  null,   // { email, role }
      isAuth: false,

      /** Call after receiving JWT from server */
      login: (jwt) => {
        const payload = decodeJwt(jwt);
        set({
          token:  jwt,
          user:   { email: payload?.sub ?? "", role: payload?.role ?? "ADMIN" },
          isAuth: true,
        });
      },

      logout: () => set({ token: null, user: null, isAuth: false }),

      /** Run on app boot — evict expired tokens */
      restoreSession: () => {
        const { token } = get();
        if (token && !isTokenValid(token)) {
          set({ token: null, user: null, isAuth: false });
        }
      },
    }),
    {
      name: "logi-auth",          // localStorage key
      partialize: (s) => ({ token: s.token, user: s.user, isAuth: s.isAuth }),
    }
  )
);

export default useAuthStore;
export { isTokenValid, decodeJwt };
