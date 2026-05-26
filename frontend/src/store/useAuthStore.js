import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ROLES } from "../constants/roles";

function decodeJwt(token) {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
}
function isTokenValid(token) {
  if (!token) return false;
  const p = decodeJwt(token);
  return p?.exp ? p.exp * 1000 > Date.now() : false;
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      token:  null,
      user:   null,   // { email, role, name?, id?, phone?, licenseNumber?, vehicleAssigned?, available? }
      isAuth: false,

      login: (data) => {
        let token, email, role;
        if (typeof data === "string") {
          token = data;
          const p = decodeJwt(data);
          email = p?.sub ?? "";
          role  = p?.role ?? null;
        } else {
          token = data.token;
          email = data.email;
          role  = data.role;
        }
        set({ token, user: { email, role }, isAuth: true });
      },

      setProfile: (profile) => {
        set((s) => ({
          user: { ...s.user, ...profile },
        }));
      },

      logout: () => set({ token: null, user: null, isAuth: false }),

      restoreSession: () => {
        const { token } = get();
        if (token && !isTokenValid(token)) {
          set({ token: null, user: null, isAuth: false });
        }
      },

      // ── RBAC helpers ──────────────────────────────────────────────────────
      isAdmin:  () => get().user?.role === ROLES.ADMIN,
      isDriver: () => get().user?.role === ROLES.DRIVER,
      hasRole:  (roles = []) => roles.includes(get().user?.role),
    }),
    {
      name: "logi-auth",
      partialize: (s) => ({ token: s.token, user: s.user, isAuth: s.isAuth }),
    }
  )
);

export default useAuthStore;
export { isTokenValid, decodeJwt };
