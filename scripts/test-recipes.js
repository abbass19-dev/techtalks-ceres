const http = require("http");

async function test() {
  const BASE_URL = "http://localhost:3000/api";
  
  // Register user
  const registerRes = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `test_recipe_${Date.now()}@example.com`,
      password: "password123",
      firstName: "Test",
      lastName: "RecipeUser",
      phoneNumber: "1234567890"
    })
  });
  
  const tokenCookie = registerRes.headers.get("set-cookie")?.split(";")[0] || "";
  if (!tokenCookie) {
    console.error("Failed to get token:", await registerRes.text());
    return;
  }
  
  console.log("Token acquired.");

  // Test POST
  console.log("\nTesting POST /api/recipes/add...");
  // Using application/json
  const postRes = await fetch(`${BASE_URL}/recipes/add`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Cookie": tokenCookie
    },
    body: JSON.stringify({
      title: "Test Recipe " + Date.now(),
      description: "A test recipe",
      timeToCook: 30,
      calories: 500,
      ingredients: [{ name: "Tomato", amount: "2", category: "Vegetable" }],
      instructions: ["Step 1", "Step 2"],
      tags: ["test"],
      mealType: "lunch"
    })
  });
  const postData = await postRes.json();
  console.log("POST Response:", postData);

  // Test GET all
  console.log("\nTesting GET /api/recipes...");
  const getRes = await fetch(`${BASE_URL}/recipes`, {
    headers: { "Cookie": tokenCookie }
  });
  const getData = await getRes.json();
  console.log(`GET Response: Found ${getData.recipes?.length} recipes`);
  
  // Test GET userOnly
  console.log("\nTesting GET /api/recipes?userOnly=true ...");
  const getUserRes = await fetch(`${BASE_URL}/recipes?userOnly=true`, {
    headers: { "Cookie": tokenCookie }
  });
  const getUserData = await getUserRes.json();
  console.log(`GET userOnly Response: Found ${getUserData.recipes?.length} recipes`);
}

test().catch(console.error);
