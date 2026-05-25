import API from "../api/axios";

const shipmentService = {
  getAll: ()                        => API.get("/shipments/all").then(r => r.data),
  getMyShipments: (email)           => API.get(`/shipments/my-shipments/${encodeURIComponent(email)}`).then(r => r.data),
  getByTrackingId: (id)             => API.get(`/shipments/${id}`).then(r => r.data),
  create: (data)                    => API.post("/shipments/save", data).then(r => r.data),
  updateStatus: (trackingId, status)  => API.put(`/shipments/update-status/${trackingId}?status=${encodeURIComponent(status)}`).then(r => r.data),
  assignDriver: (trackingId, driverId)=> API.put(`/shipments/assign-driver/${trackingId}${driverId ? `?driverId=${driverId}` : ''}`).then(r => r.data),
  assignVehicle: (trackingId, vehicle)=> API.put(`/shipments/assign-vehicle/${trackingId}?vehicle=${encodeURIComponent(vehicle)}`).then(r => r.data),
};

export default shipmentService;
