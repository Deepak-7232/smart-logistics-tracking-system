const axios = require('axios');

async function testUpdate() {
  try {
    const loginRes = await axios.post('http://localhost:8080/auth/login', {
      email: 'deepak@gmail.com',
      password: '123456'
    });
    const token = loginRes.data.token;
    console.log("Logged in as Admin");

    const driversRes = await axios.get('http://localhost:8080/drivers/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const drivers = driversRes.data;
    console.log(`Drivers:`, JSON.stringify(drivers, null, 2));

    const shipRes = await axios.get('http://localhost:8080/shipments/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Shipments:`, JSON.stringify(shipRes.data, null, 2));
    
    const trackingId = "TRA27003";
    // Find Sohil's ID
    const driverId = drivers.find(d => d.name.includes("Sohil"))?.id;
    console.log(`Using driver ID ${driverId}`);

    console.log(`Updating status...`);
    try {
      const res = await axios.put(`http://localhost:8080/shipments/update-status/${trackingId}?status=IN_TRANSIT`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Update status:", res.status);
    } catch (e) {
      console.error("Update status failed:", e.response ? e.response.status + " " + JSON.stringify(e.response.data) : e.message);
    }

    console.log(`Assigning driver...`);
    try {
      const res = await axios.put(`http://localhost:8080/shipments/assign-driver/${trackingId}?driverId=${driverId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Assign driver status:", res.status);
    } catch (e) {
      console.error("Assign driver failed:", e.response ? e.response.status + " " + JSON.stringify(e.response.data) : e.message);
    }

    console.log(`Assigning vehicle...`);
    try {
      const res = await axios.put(`http://localhost:8080/shipments/assign-vehicle/${trackingId}?vehicle=BH01NH24`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Assign vehicle status:", res.status);
    } catch (e) {
      console.error("Assign vehicle failed:", e.response ? e.response.status + " " + JSON.stringify(e.response.data) : e.message);
    }
  } catch (e) {
    console.error("Failed:", e.response ? e.response.status + " " + e.response.data : e.message);
  }
}

testUpdate();
