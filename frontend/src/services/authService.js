import API from "../api/axios";

const authService = {
  /** POST /auth/login → { token, email, role } */
  login: async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    return res.data;
  },

  /**
   * POST /auth/register
   * Body: { name, email, password, phone, licenseNumber }
   * Backend auto-sets role=DRIVER, available=true
   */
  register: async (data) => {
    const res = await API.post("/auth/register", data);
    return res.data;
  },

  /** GET /drivers/me/{email} — fetch own profile after login */
  getMyProfile: async (email) => {
    const res = await API.get(`/drivers/me/${encodeURIComponent(email)}`);
    return res.data;
  },
};

export default authService;
