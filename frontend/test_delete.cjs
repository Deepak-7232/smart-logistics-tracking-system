const axios = require('axios');

async function testDelete() {
  try {
    const loginRes = await axios.post('http://localhost:8080/auth/login', {
      email: 'deepak@gmail.com',
      password: '123456'
    });
    const token = loginRes.data.token;
    console.log("Logged in as Admin");

    const shipRes = await axios.get('http://localhost:8080/shipments/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Shipments:", JSON.stringify(shipRes.data, null, 2));
  } catch (e) {
    console.error("Failed:", e.response ? e.response.status + " " + e.response.data : e.message);
  }
}

testDelete();
