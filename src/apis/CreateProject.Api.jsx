export const createProjectAPI = async (prompt) => {
console.log("🟢 Create Project API Sending =>", prompt);

// ✅ Get token from localStorage
const authToken = localStorage.getItem("signin_token");
if (!authToken) throw new Error("No auth token found");

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Bearer ${authToken}`);

const raw = JSON.stringify({ prompt });

const requestOptions = {
method: "POST",
headers: myHeaders,
body: raw,
redirect: "follow",
};

try {
// ✅ Corrected endpoint (matches your previous working pattern)
const res = await fetch("https://gateway.codeastra.ai/projects/api/v1/projects", requestOptions);

 
// Check for gateway timeout or bad response
if (!res.ok) {
  const text = await res.text();
  console.error("❌ API Raw Response =>", text);
  throw new Error(`Server Error: ${res.status} - ${text}`);
}

const data = await res.json();
console.log("✅ Project Created =>", data);
return data;
 

} catch (error) {
console.error("❌ API Error =>", error.message);
throw error;
}
};
