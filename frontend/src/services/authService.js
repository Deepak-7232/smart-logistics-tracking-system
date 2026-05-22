import API from "../api/axios";

const authService = {
  login: async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    return res.data; // returns JWT string or "Invalid Credentials"
  },
};

export default authService;
