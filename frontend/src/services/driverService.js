import API from "../api/axios";

const driverService = {
  getAll:  ()     => API.get("/drivers/all").then(r => r.data),
  create:  (data) => API.post("/drivers/save", data).then(r => r.data),
  delete:  (id)   => API.delete(`/drivers/${id}`).then(r => r.data),
};

export default driverService;
