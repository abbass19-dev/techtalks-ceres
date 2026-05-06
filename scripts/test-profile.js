const http = require("http");

async function test() {
  const BASE_URL = "http://localhost:3000/api";
  
  console.log("1. Registering test user...");
  // Register a user to get the JWT token cookie
  const registerRes = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `test${Date.now()}@example.com`,
      password: "password123",
      firstName: "Test",
      lastName: "User",
      phoneNumber: "1234567890"
    })
  });
  
  const tokenCookie = registerRes.headers.get("set-cookie")?.split(";")[0] || "";
  
  if (!tokenCookie) {
    console.error("Failed to get token cookie:", await registerRes.text());
    return;
  }
  console.log("Token cookie acquired successfully.");

  console.log("\n2. Testing GET /api/auth/me ...");
  const getRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { "Cookie": tokenCookie }
  });
  const getData = await getRes.json();
  console.log("GET /api/auth/me Response:", getData);

  console.log("\n3. Testing PATCH /api/auth/me/update ...");
  const patchRes = await fetch(`${BASE_URL}/auth/me/update`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Cookie": tokenCookie
    },
    body: JSON.stringify({
      weight: 75,
      height: 180,
      age: 30
    })
  });
  const patchData = await patchRes.json();
  console.log("PATCH /api/auth/me/update Response:", patchData);

  console.log("\n4. Testing GET /api/auth/me again to verify update ...");
  const getRes2 = await fetch(`${BASE_URL}/auth/me`, {
    headers: { "Cookie": tokenCookie }
  });
  const getData2 = await getRes2.json();
  console.log("GET /api/auth/me Response (after update):", getData2);
}

test().catch(console.error);
