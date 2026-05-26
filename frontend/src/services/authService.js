import API from "../api/axios";

const authService = {
  login: async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    return res.data;
  },

  
  register: async (data) => {
    const res = await API.post("/auth/register", data);
    return res.data;
  },

  getMyProfile: async (email) => {
    const res = await API.get(`/drivers/me/${encodeURIComponent(email)}`);
    return res.data;
  },
};

export default authService;
