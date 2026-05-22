import API from "../api/axios";

const vehicleService = {
  getAll:  ()     => API.get("/vehicles/all").then(r => r.data),
  create:  (data) => API.post("/vehicles/save", data).then(r => r.data),
  delete:  (id)   => API.delete(`/vehicles/${id}`).then(r => r.data),
};

export default vehicleService;
